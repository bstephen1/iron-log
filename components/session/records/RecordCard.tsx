import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import StyledDivider from '../../../components/StyledDivider'
import {
  updateExerciseFields,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { DATE_FORMAT, QUERY_KEYS } from '../../../lib/frontend/constants'
import {
  useExercises,
  useUpdateMutation,
} from '../../../lib/frontend/restService'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import useExtraWeight from '../../../lib/frontend/useExtraWeight'
import useNoSwipingDesktop from '../../../lib/frontend/useNoSwipingDesktop'
import type { PartialUpdate } from '../../../lib/types'
import { ArrayMatchType } from '../../../models//ArrayMatchType'
import type { Exercise } from '../../../models/AsyncSelectorOption/Exercise'
import type { Record, RecordQuery } from '../../../models/Record'
import { calculateTotalValue } from '../../../models/Set'
import HistoryCardsSwiper from '../history/HistoryCardsSwiper'
import HistoryTitle from '../history/HistoryTitle'
import RecordCardHeader from './header/RecordCardHeader'
import RecordExerciseSelector from './RecordExerciseSelector'
import RecordModifierComboBox from './RecordModifierComboBox'
import SetTypeSelect from './SetTypeSelect'
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
  record: Record
  swiperIndex: number
}
/** Record card with loaded record data.
 *
 * Note: This is an expensive component to render. Children should be memoized
 * so they only rerender when needed.
 *
 * Memoized components without primitive props can make use of the second arg
 * for memo() to use the custom equality comparison function isEqual() from lodash.
 * Otherwise they'll still be rerendered because the mutation creates a new object.
 */
export default function RecordCard({
  swiperIndex,
  record,
}: Props & {
  record: Record
}) {
  // Instead of using record.exercise, we make a separate call to get the exercise.
  // This ensures the exercise is up to date if the user has multiple records with the
  // same exercise. record.exercise is only updated upon fetching the record,
  // so if one record updated an exercise any other records would still be using the outdated exercise.
  const exercises = useExercises()
  const exercise = exercises.index[record.exercise?._id ?? ''] ?? null
  const { activeModifiers, _id, sets, notes, category, setType, date } = record
  const displayFields = useDisplayFields(exercise)
  const { extraWeight, exerciseWeight } = useExtraWeight(record)
  const noSwipingDesktop = useNoSwipingDesktop()
  const updateRecordMutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.records, { date }],
    updateFn: updateRecordFields,
  })
  const updateExerciseMutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.exercises],
    updateFn: updateExerciseFields,
  })

  const showSplitWeight = exercise?.attributes.bodyweight || !!extraWeight
  const showUnilateral = exercise?.attributes.unilateral

  const historyQuery: RecordQuery = {
    modifiers: activeModifiers,
    // don't want to include the current record in its own history
    end: dayjs(date).add(-1, 'day').format(DATE_FORMAT),
    exercise: exercise?.name,
    limit: 5,
    modifierMatchType: ArrayMatchType.Exact,
    setTypeMatchType: ArrayMatchType.Exact,
    setType,
  }

  const mutateExerciseFields: PartialUpdate<Exercise> = useCallback(
    (updates) => {
      exercise?._id && updateExerciseMutate({ _id: exercise._id, updates })
    },
    [exercise?._id, updateExerciseMutate]
  )

  const mutateRecordFields: PartialUpdate<Record> = useCallback(
    (updates) => {
      updateRecordMutate({ _id: record._id, updates })
    },
    [record._id, updateRecordMutate]
  )

  return (
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
          {/* NOTE: sets do not use mutateRecordFields from the parent */}
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
  )
}
