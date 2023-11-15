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
  const [unsavedQuery, setUnsavedQuery] =
    useState<RecordHistoryQuery>(initialQuery)
  const displayFields = useDisplayFields(exercise)

  return (
    <>
      {/* <FormDivider title="Filter" /> */}
      <Stack spacing={2}>
        <RecordExerciseSelector
          disableAddNew
          mutateRecordFields={async ({ exercise, activeModifiers }) => {
            setExercise(exercise ?? null)
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
          matchType={unsavedQuery.modifierMatchType}
          options={exercise?.modifiers || []}
          initialValue={unsavedQuery.modifier || []}
          updateQuery={(changes) =>
            setUnsavedQuery((prev) => ({ ...prev, ...changes }))
          }
        />
        <SetTypeQueryField
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
            disabled={isEqual(unsavedQuery, query)}
            onClick={() => setUnsavedQuery(initialQuery)}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            disabled={isEqual(unsavedQuery, query)}
            onClick={() => setQuery(unsavedQuery)}
          >
            Update Filter
          </Button>
        </Stack>
      </Stack>
    </>
  )
}

const FormDivider = ({ title }: { title: string }) => (
  <Divider sx={{ pb: 2 }}>{title}</Divider>
)
