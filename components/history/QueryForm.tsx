import { Button, Stack } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import isEqual from 'react-fast-compare'
import NumericFieldAutosave from '../../components/form-fields/NumericFieldAutosave'
import RecordExerciseSelector from '../../components/session/records/RecordExerciseSelector'
import useDisplayFields from '../../lib/frontend/useDisplayFields'
import { UpdateState } from '../../lib/util'
import { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import {
  DEFAULT_RECORD_HISTORY_QUERY,
  RecordHistoryQuery,
} from '../../models/query-filters/RecordQuery'
import ModifierQueryField from './ModifierQueryField'
import QueryDateRangePicker from './QueryDateRangePicker'
import SetTypeQueryField from './SetTypeQueryField'

interface Props {
  query?: RecordHistoryQuery
  setQuery: Dispatch<SetStateAction<RecordHistoryQuery | undefined>>
}
export default function QueryCard({ query, setQuery }: Props) {
  const initialQuery = query ?? DEFAULT_RECORD_HISTORY_QUERY
  // todo: this should use exercise from query
  const [exercise, setExercise] = useState<Exercise | null>(null)
  // reset to this exercise if reset button is clicked
  const [initialExercise, setInitialExercise] = useState(exercise)
  const [unsavedQuery, setUnsavedQuery] =
    useState<RecordHistoryQuery>(initialQuery)
  const displayFields = useDisplayFields(exercise)

  const updateUnsavedQuery: UpdateState<RecordHistoryQuery> = (changes) =>
    setUnsavedQuery((prev) => ({ ...prev, ...changes }))

  return (
    <Stack spacing={2}>
      <RecordExerciseSelector
        disableAddNew
        mutateRecordFields={async ({ exercise, activeModifiers }) => {
          setExercise(exercise ?? null)
          updateUnsavedQuery({
            exercise: exercise?.name ?? '',
          })
          if (activeModifiers) {
            updateUnsavedQuery({
              modifier: activeModifiers,
            })
          }
        }}
        activeModifiers={unsavedQuery.modifier}
        exercise={exercise}
        category={null}
        variant="outlined"
      />
      <ModifierQueryField
        disabled={!exercise}
        matchType={unsavedQuery.modifierMatchType}
        options={exercise?.modifiers || []}
        initialValue={unsavedQuery.modifier}
        updateQuery={updateUnsavedQuery}
      />
      <SetTypeQueryField
        disabled={!exercise}
        units={displayFields.units}
        query={unsavedQuery}
        updateQuery={updateUnsavedQuery}
      />
      <NumericFieldAutosave
        label="Record limit"
        initialValue={unsavedQuery.limit}
        placeholder="None"
        handleSubmit={(limit) => updateUnsavedQuery({ limit })}
        variant="outlined"
        debounceMilliseconds={0}
        alwaysShrinkLabel
      />
      <QueryDateRangePicker
        query={unsavedQuery}
        updateQuery={updateUnsavedQuery}
      />
      <Stack direction="row" spacing={2} display="flex" justifyContent="center">
        <Button
          variant="outlined"
          // there is no query on init, so just disable reset
          disabled={!query || isEqual(unsavedQuery, query)}
          onClick={() => {
            setUnsavedQuery(initialQuery)
            setExercise(initialExercise)
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          disabled={isEqual(unsavedQuery, query)}
          onClick={() => {
            setInitialExercise(exercise)
            setQuery(unsavedQuery)
          }}
        >
          Update Filter
        </Button>
      </Stack>
    </Stack>
  )
}
