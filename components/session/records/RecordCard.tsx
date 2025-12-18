import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import StyledDivider from '../../../components/StyledDivider'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import { useExercise, useRecord } from '../../../lib/frontend/data/useQuery'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import useExtraWeight from '../../../lib/frontend/useExtraWeight'
import useNoSwipingDesktop from '../../../lib/frontend/useNoSwipingDesktop'
import { ArrayMatchType } from '../../../models//ArrayMatchType'
import type { RecordQuery } from '../../../models/Record'
import type { HistoryAction, HistoryContent } from '../history/HistoryCard'
import HistoryCardsSwiper from '../history/HistoryCardsSwiper'
import HistoryTitle from '../history/HistoryTitle'
import RecordCardHeader from './header/RecordCardHeader'
import RecordExerciseSelector from './RecordExerciseSelector'
import RecordModifierComboBox from './RecordModifierComboBox'
import RecordSetTypeSelect from './RecordSetTypeSelect'
import RenderSets from './sets/RenderSets'

// Note: mui icons MUST use path imports instead of named imports!
// Otherwise in prod there will be serverless function timeout errors. Path imports also
// make loading significantly faster. Apparently the auto tree-shaking
// mui advertises does not actually work, or isn't set up properly.
// The icons were not causing any issues until 2023/03/06, when an updated
// prod build retractively made every build fail to work.
// See difference between path/named import: https://mui.com/material-ui/guides/minimizing-bundle-size/#option-one-use-path-imports
// See bug: https://github.com/orgs/vercel/discussions/1657

const historyActions: HistoryAction[] = ['recordNotes']
const historyContent: HistoryContent[] = ['sets']

interface Props {
  id: string
  swiperIndex: number
  date: string
}
/** Record card with loaded record data.
 *
 * Note: This is an expensive component to render. Children should be memoized
 * so they only rerender when needed.
 *
 * Memoized components without primitive props can make use of the second arg
 * for memo() to use the custom equality comparison function isEqual().
 * Otherwise they'll still be rerendered because the mutation creates a new object.
 */
export default function RecordCard({ swiperIndex, id, date }: Props) {
  // Instead of using record.exercise, we make a separate call to get the exercise.
  // This ensures the exercise is up to date if the user has multiple records with the
  // same exercise. record.exercise is only updated upon fetching the record,
  // so if one record updated an exercise any other records would still be using the outdated exercise.
  const record = useRecord(id, date)
  const exercise = useExercise(record.exercise?._id)
  const { activeModifiers, _id, sets, notes, setType } = record
  const displayFields = useDisplayFields(exercise)
  const { extraWeight, exerciseWeight } = useExtraWeight(record)
  const noSwipingDesktop = useNoSwipingDesktop()
  const showSplitWeight = exercise?.attributes.bodyweight || !!extraWeight
  const showUnilateral = exercise?.attributes.unilateral

  const historyQuery: RecordQuery = useMemo(
    () => ({
      modifiers: activeModifiers,
      // don't want to include the current record in its own history
      end: dayjs(date).add(-1, 'day').format(DATE_FORMAT),
      exercise: exercise?.name,
      limit: 5,
      modifierMatchType: ArrayMatchType.Exact,
      setTypeMatchType: ArrayMatchType.Exact,
      setType,
    }),
    [activeModifiers, date, exercise?.name, setType]
  )

  return (
    <Card elevation={3} sx={{ px: 1, m: 0.5 }}>
      <RecordCardHeader
        exerciseId={exercise?._id}
        exerciseName={exercise?.name}
        exerciseNotes={exercise?.notes}
        {...{
          swiperIndex,
          _id,
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
            // disableClearable prevents null from ever being allowed.
            // There should always be an exercise in actual usage, but some test envs
            // may init without one selected.
            disableClearable={!!exercise}
            {...{ _id, date, activeModifiers, exercise }}
          />
          <RecordModifierComboBox
            className={noSwipingDesktop}
            availableModifiers={exercise?.modifiers}
            {...{ _id, activeModifiers }}
          />
          <RecordSetTypeSelect {...{ _id, date }} />
          <RenderSets
            exerciseId={exercise?._id}
            {...{
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
            actions={historyActions}
            content={historyContent}
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
