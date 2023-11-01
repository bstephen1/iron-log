import { Card, CardContent, Stack, Typography } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import RecordCardSkeleton from 'components/loading/RecordCardSkeleton'
import StyledDivider from 'components/StyledDivider'
import { updateExerciseFields, useRecord } from 'lib/frontend/restService'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import HistoryCardsSwiper from '../history/HistoryCardsSwiper'
import HistoryTitle from '../history/HistoryTitle'
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
    // bug: need to actually mutate the records. This will revert updates if a different exercise is updated.
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
    record,
    displayFields,
    mutate: mutateRecord,
    updateFields,
  } = useCurrentRecord()

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
            handleExerciseFieldsChange,
            swiperIndex,
          }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
        <CardContent
          // swiping causes weird behavior on desktop when combined with data input fields
          sx={{ px: 1 }}
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
            <HistoryTitle />
            <HistoryCardsSwiper isQuickRender={isQuickRender} />
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}
