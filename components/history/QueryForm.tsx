import { Button, Divider, Stack } from '@mui/material'
import RecordExerciseSelector from 'components/session/records/RecordExerciseSelector'
import useDisplayFields from 'lib/frontend/useDisplayFields'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import {
  DEFAULT_RECORD_HISTORY_QUERY,
  RecordHistoryQuery,
} from 'models/query-filters/RecordQuery'
import { Dispatch, SetStateAction, useState } from 'react'
import isEqual from 'react-fast-compare'
import ModifierQueryField from './ModifierQueryField'
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

  return (
    <>
      <Stack spacing={2}>
        <RecordExerciseSelector
          disableAddNew
          mutateRecordFields={async ({ exercise, activeModifiers }) => {
            setExercise((prev) => {
              setInitialExercise(prev)
              return exercise ?? null
            })
            setUnsavedQuery((prev) => ({
              ...prev,
              exercise: exercise?.name ?? '',
            }))
            if (activeModifiers) {
              setUnsavedQuery((prev) => ({
                ...prev,
                modifier: activeModifiers,
              }))
            }
          }}
          activeModifiers={unsavedQuery.modifier ?? []}
          exercise={exercise}
          category={null}
          variant="outlined"
        />
        <ModifierQueryField
          disabled={!exercise}
          matchType={unsavedQuery.modifierMatchType}
          options={exercise?.modifiers || []}
          initialValue={unsavedQuery.modifier || []}
          updateQuery={(changes) =>
            setUnsavedQuery((prev) => ({ ...prev, ...changes }))
          }
        />
        <SetTypeQueryField
          disabled={!exercise}
          units={displayFields.units}
          query={unsavedQuery}
          updateQuery={(changes) =>
            setUnsavedQuery((prev) => ({ ...prev, ...changes }))
          }
        />
        <Stack
          direction="row"
          spacing={2}
          display="flex"
          justifyContent="center"
        >
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
            disabled={!exercise || isEqual(unsavedQuery, query)}
            onClick={() => setQuery(unsavedQuery)}
          >
            Update Filter
          </Button>
        </Stack>
      </Stack>
    </>
  )
}
