import { Card, CardContent, Stack, Typography } from '@mui/material'
import RecordCardSkeleton from 'components/loading/RecordCardSkeleton'
import StyledDivider from 'components/StyledDivider'
import { noSwipingRecord } from 'lib/frontend/constants'
import {
  updateExerciseFields,
  updateRecordFields,
  useRecord,
} from 'lib/frontend/restService'
import { UpdateFields } from 'lib/util'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import Record, { SetType } from 'models/Record'
import { Set } from 'models/Set'
import { useCallback } from 'react'
import HistoryCardsSwiper from '../history/HistoryCardsSwiper'
import HistoryTitle from '../history/HistoryTitle'
import RecordCardHeader from './header/RecordCardHeader'
import { RecordContext } from './RecordContext'
import RecordExerciseSelector from './RecordExerciseSelector'
import RecordModifierComboBox from './RecordModifierComboBox'
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

/** Returns total reps over all sets when operator is "total", otherwise zero. */
const calculateTotalReps = (sets: Set[], { field, operator }: SetType) => {
  return operator === 'total'
    ? sets.reduce((total, set) => total + Number(set[field] ?? 0), 0)
    : 0
}

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
          record={record}
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
  record,
}: Props & {
  record: Record
}) {
  const { displayFields, mutate: mutateRecord } = useCurrentRecord()
  const { exercise, activeModifiers, _id, sets, notes, category, setType } =
    record

  const mutateExerciseFields: UpdateFields<Exercise> = useCallback(
    async (changes) => {
      mutateRecord(
        (cur) => {
          if (!cur?.exercise) return null

          const newExercise = { ...cur.exercise, ...changes }
          setMostRecentlyUpdatedExercise(newExercise)
          updateExerciseFields(cur.exercise, { ...changes })
          return { ...cur, exercise: newExercise }
        },
        { revalidate: false }
      )
    },
    [mutateRecord, setMostRecentlyUpdatedExercise]
  )

  const mutateRecordFields: UpdateFields<Record> = useCallback(
    async (changes) => {
      mutateRecord(updateRecordFields(_id, { ...changes }), {
        optimisticData: (cur) => (cur ? { ...cur, ...changes } : null),
        revalidate: false,
      })
    },
    [mutateRecord, _id]
  )

  // todo: add Category to Record so it persists (if exercise is filtered; mainly for programming)
  return (
    <>
      <Card elevation={3} sx={{ px: 1, m: 0.5 }}>
        <RecordCardHeader
          {...{
            mutateExerciseFields,
            swiperIndex,
            mutateRecordFields,
            _id,
            sets,
            exercise,
            notes,
            displayFields,
          }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
        <CardContent
          // swiping causes weird behavior on desktop when combined with data input fields
          sx={{ px: 1 }}
        >
          <Stack spacing={2}>
            <RecordExerciseSelector
              {...{ mutateRecordFields, activeModifiers, exercise, category }}
            />
            <RecordModifierComboBox
              availableModifiers={exercise?.modifiers}
              {...{ mutateRecordFields, activeModifiers }}
            />
            <SetTypeSelect
              noSwipingClassName={noSwipingRecord}
              units={displayFields.units}
              totalReps={calculateTotalReps(sets, setType)}
              {...{ mutateRecordFields, setType }}
            />
            <RenderSets
              noSwipingClassName={noSwipingRecord}
              {...{ mutateExerciseFields, displayFields, sets }}
            />
            <HistoryTitle />
            <HistoryCardsSwiper isQuickRender={isQuickRender} />
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}
