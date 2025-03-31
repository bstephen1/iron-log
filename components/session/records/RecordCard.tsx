import { Card, CardContent, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { memo, useCallback } from 'react'
import { KeyedMutator } from 'swr'
import StyledDivider from '../../../components/StyledDivider'
import RecordCardSkeleton from '../../../components/loading/RecordCardSkeleton'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import {
  updateExerciseFields,
  updateRecordFields,
  useExercise,
  useRecord,
} from '../../../lib/frontend/restService'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import useExtraWeight from '../../../lib/frontend/useExtraWeight'
import useNoSwipingDesktop from '../../../lib/frontend/useNoSwipingDesktop'
import { UpdateFields } from '../../../lib/util'
import { Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import { Record } from '../../../models/Record'
import { calculateTotalValue } from '../../../models/Set'
import { MatchType } from '../../../models/query-filters/MongoQuery'
import HistoryCardsSwiper from '../history/HistoryCardsSwiper'
import HistoryTitle from '../history/HistoryTitle'
import RecordExerciseSelector from './RecordExerciseSelector'
import RecordModifierComboBox from './RecordModifierComboBox'
import SetTypeSelect from './SetTypeSelect'
import RecordCardHeader from './header/RecordCardHeader'
import RenderSets from './sets/RenderSets'

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
  swiperIndex: number
}
export default memo(function RecordCard(props: Props) {
  const { id, swiperIndex } = props
  const { record, mutate: mutateRecord } = useRecord(id)
  // Instead of using record.exercise, we make a separate rest call to get the exercise.
  // This ensures the exercise is up to date if the user has multiple records with the
  // same exercise. record.exercise is only updated upon fetching the record,
  // so if one record updated an exercise any other records would still be using the outdated exercise.
  const { exercise, mutate: mutateExercise } = useExercise(
    record?.exercise?._id ?? null
  )

  if (record === undefined || exercise === undefined || props.isQuickRender) {
    return (
      <RecordCardSkeleton title={`Record ${swiperIndex + 1}`} showSetButton />
    )
  } else if (record === null) {
    return (
      <RecordCardSkeleton
        title={`Record ${swiperIndex + 1}`}
        Content={
          <Typography textAlign="center">
            Could not find record! Try reloading.
          </Typography>
        }
      />
    )
  } else {
    return (
      <LoadedRecordCard
        {...{ record, exercise, mutateRecord, mutateExercise, ...props }}
      />
    )
  }
})

/** Record card with loaded record data.
 *
 * Note: This is an expensive component to render. Children should be memoized
 * so they only rerender when needed. With SWR, any time a given swr hook triggers
 * mutate(), any component using that hook will trigger a rerender. This means
 * children should NOT useRecord, or they will always rerender whenever any part of
 * the record is mutated. Instead, they should be passed only the props they need.
 * Context can also not be used because it works like swr -- any change to
 * the record will trigger a rerender.
 *
 * Memoized components without primitive props can make use of the second arg
 * for memo() to use the custom equality comparison function isEqual() from lodash.
 * Otherwise they'll still be rerendered because the mutation creates a new object.
 */
function LoadedRecordCard({
  swiperIndex,
  record,
  exercise,
  mutateRecord,
  mutateExercise,
}: Props & {
  record: Record
  exercise: Exercise | null
  mutateRecord: KeyedMutator<Record | null>
  mutateExercise: KeyedMutator<Exercise | null>
}) {
  const { activeModifiers, _id, sets, notes, category, setType, date } = record
  const displayFields = useDisplayFields(exercise)
  const { extraWeight, exerciseWeight } = useExtraWeight(record)
  const noSwipingDesktop = useNoSwipingDesktop()

  const showSplitWeight = exercise?.attributes.bodyweight || !!extraWeight
  const showUnilateral = exercise?.attributes.unilateral

  const historyQuery = {
    modifier: activeModifiers,
    // don't want to include the current record in its own history
    end: dayjs(date).add(-1, 'day').format(DATE_FORMAT),
    exercise: exercise?.name,
    limit: 5,
    modifierMatchType: MatchType.Exact,
    setTypeMatchType: MatchType.Exact,
    ...setType,
  }

  const mutateExerciseFields: UpdateFields<Exercise> = useCallback(
    async (changes) => {
      mutateExercise(
        (cur) => (cur ? updateExerciseFields(cur, { ...changes }) : null),
        {
          optimisticData: (cur) => (cur ? { ...cur, ...changes } : null),
          revalidate: false,
        }
      )
    },
    [mutateExercise]
  )

  const mutateRecordFields: UpdateFields<Record> = useCallback(
    async (changes) => {
      mutateRecord(
        (cur) => (cur ? updateRecordFields(cur._id, { ...changes }) : null),
        {
          optimisticData: (cur) => (cur ? { ...cur, ...changes } : null),
          revalidate: false,
        }
      )
    },
    [mutateRecord]
  )

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
            date,
          }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
        <CardContent sx={{ px: 1 }}>
          <Stack spacing={2}>
            <RecordExerciseSelector
              // swiping causes weird behavior on desktop when combined with data input fields
              // (eg, can't close autocompletes)
              className={noSwipingDesktop}
              // we can't clear it bc the recordCard presumes there is an exercise
              disableClearable
              {...{ mutateRecordFields, activeModifiers, exercise, category }}
            />
            <RecordModifierComboBox
              className={noSwipingDesktop}
              availableModifiers={exercise?.modifiers}
              {...{ mutateRecordFields, activeModifiers }}
            />
            <SetTypeSelect
              units={displayFields.units}
              totalReps={calculateTotalValue(sets, setType)}
              showRemaining
              {...{ handleChange: mutateRecordFields, setType }}
            />
            <RenderSets
              {...{
                mutateExerciseFields,
                displayFields,
                sets,
                showSplitWeight,
                showUnilateral,
                _id,
                extraWeight,
                exerciseWeight,
              }}
            />
            <HistoryTitle />
            <HistoryCardsSwiper
              query={historyQuery}
              actions={['recordNotes']}
              content={['sets']}
              {...{
                _id,
                displayFields,
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}
