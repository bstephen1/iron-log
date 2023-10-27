import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import RecordCardSkeleton from 'components/loading/RecordCardSkeleton'
import StyledDivider from 'components/StyledDivider'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'lib/frontend/constants'
import { updateExerciseFields, useRecord } from 'lib/frontend/restService'
import useNoSwipingSmScreen from 'lib/frontend/useNoSwipingSmScreen'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import Note from 'models/Note'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import { RecordQuery, SetMatchType } from 'models/query-filters/RecordQuery'
import { useState } from 'react'
import HistoryCardsSwiper from '../history/HistoryCardsSwiper'
import RecordCardHeader from './header/RecordCardHeader'
import { RecordContext } from './RecordContext'
import RecordExerciseSelector from './RecordExerciseSelector'
import RenderSets from './sets/RenderSets'
import SetTypeSelect from './SetTypeSelect'
import useCurrentRecord from './useCurrentRecord'

// Note: mui icons MUST use path imports instead of named imports!
// Otherwise in prod there will be serverless function timeout errors. Path imports also
// make loading significantly faster. Apparently the auto tree-shaking
// mui advertises does not actually work, or isn't set up properly.
// The icons were not causing any issues until 2023/03/06, when an updated
// prod build retractively made every build fail to work.
// See difference between path/named import: https://mui.com/material-ui/guides/minimizing-bundle-size/#option-one-use-path-imports
// See bug: https://github.com/orgs/vercel/discussions/1657
interface Props {
  id: string
  isQuickRender?: boolean
  setMostRecentlyUpdatedExercise: (exercise: Exercise) => void
  /** This allows records within a session that are using the same exercise to see updates to notes/displayFields */
  mostRecentlyUpdatedExercise: Exercise | null
  updateSessionNotes: (notes: Note[]) => Promise<void>
  sessionNotes: Note[]
  swiperIndex: number
}
export default function RecordCard(props: Props) {
  const { id, swiperIndex, mostRecentlyUpdatedExercise } = props
  const { record } = useRecord(id)

  if (record === undefined || (props.isQuickRender && swiperIndex > 1)) {
    return <RecordCardSkeleton title={`Record ${swiperIndex + 1}`} />
  } else if (record === null) {
    return (
      <RecordCardSkeleton
        Content={
          <Typography textAlign="center">
            Could not find record! Try reloading.
          </Typography>
        }
      />
    )
  } else {
    // Use the newly updated exercise so multiple cards with the same exercise will ripple their updates.
    // Note this doesn't mutate the underlying cache, but the cache is set up to mutate when the exercise is updated.
    const exercise =
      mostRecentlyUpdatedExercise?._id === record.exercise?._id
        ? mostRecentlyUpdatedExercise
        : record.exercise
    return (
      <RecordContext.Provider value={{ record }}>
        <LoadedRecordCard
          // key resets history filter when exercise changes or is renamed
          key={exercise?.name}
          {...props}
        />
      </RecordContext.Provider>
    )
  }
}

function LoadedRecordCard({
  swiperIndex,
  setMostRecentlyUpdatedExercise,
  isQuickRender,
}: Props) {
  const {
    exercise,
    activeModifiers,
    setType,
    _id,
    record,
    displayFields,
    mutate: mutateRecord,
    updateFields,
  } = useCurrentRecord()

  const noSwipingClassName = useNoSwipingSmScreen()

  const [historyFilter, setHistoryFilter] = useState<RecordQuery>({
    // todo: can't filter on no modifiers. Api gets "modifier=&" which is just dropped.
    modifier: record.activeModifiers,
    // don't want to include the current record in its own history
    end: dayjs(record.date).add(-1, 'day').format(DATE_FORMAT),
    exercise: record.exercise?.name,
    limit: 10,
    modifierMatchType: ArrayMatchType.Equivalent,
    setMatchType: SetMatchType.SetType,
    ...setType,
  })

  const updateFilter = (changes: Partial<RecordQuery>) =>
    setHistoryFilter((prevState) => ({ ...prevState, ...changes }))

  const handleExerciseFieldsChange = async (changes: Partial<Exercise>) => {
    if (!exercise) return

    const newExercise = { ...exercise, ...changes }
    // todo: is there a way to get swr to revalidate specific records?
    // Need to revalidate any record with the same exercise._id
    mutateRecord({ ...record, exercise: newExercise }, { revalidate: false })
    setMostRecentlyUpdatedExercise(newExercise)
    await updateExerciseFields(exercise, { ...changes })
  }

  // todo: add Category to Record so it persists (if exercise is filtered; mainly for programming)
  return (
    <>
      <Card elevation={3} sx={{ px: 1, m: 0.5 }}>
        <RecordCardHeader
          {...{
            historyFilter,
            updateFilter,
            handleExerciseFieldsChange,
            swiperIndex,
          }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
        <CardContent
          // swiping causes weird behavior on desktop when combined with data input fields
          className={noSwipingClassName}
          sx={{ cursor: { sm: 'default' }, px: 1 }}
        >
          <Stack spacing={2}>
            <RecordExerciseSelector />
            <ComboBoxField
              label="Modifiers"
              options={exercise?.modifiers}
              initialValue={activeModifiers}
              variant="standard"
              helperText=""
              handleSubmit={(value: string[]) =>
                updateFields({ activeModifiers: value })
              }
            />
            <SetTypeSelect showTotal />
            <RenderSets
              handleExerciseFieldsChange={handleExerciseFieldsChange}
              displayFields={displayFields}
            />
          </Stack>
        </CardContent>
        <Box pt={3}>
          <HistoryCardsSwiper
            isQuickRender={isQuickRender}
            filter={historyFilter}
            paginationId={_id}
            displayFields={displayFields}
          />
        </Box>
      </Card>
    </>
  )
}
