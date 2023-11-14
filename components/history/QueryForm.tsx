import { Checkbox, Divider, Stack } from '@mui/material'
import SelectFieldAutosave from 'components/form-fields/SelectFieldAutosave'
import RecordExerciseSelector from 'components/session/records/RecordExerciseSelector'
import SetTypeSelect from 'components/session/records/SetTypeSelect'
import useDisplayFields from 'lib/frontend/useDisplayFields'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { DEFAULT_SET_TYPE } from 'models/Record'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import { Dispatch, SetStateAction, useState } from 'react'
import ModifierQueryField from './ModifierQueryField'

interface ActiveHistoryFields {
  exercise: boolean
  setType: boolean
  modifiers: boolean
  modifierMatchType: boolean
  dateRange: boolean
}

interface Props {
  query?: RecordQuery
  setQuery: Dispatch<SetStateAction<RecordQuery | undefined>>
}
export default function QueryCard({ query = {}, setQuery }: Props) {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [setType, setSetType] = useState(DEFAULT_SET_TYPE)
  const [modifiers, setModifiers] = useState<string[]>([])
  const [activeFields, setActiveFields] = useState<ActiveHistoryFields>({
    exercise: true,
    setType: true,
    modifiers: true,
    modifierMatchType: true,
    dateRange: false,
  })
  const displayFields = useDisplayFields(exercise)

  return (
    <>
      {/* <FormDivider title="Filter" /> */}
      <Stack spacing={2}>
        <Stack direction="row">
          <Checkbox
            aria-label="exercise-filter"
            checked={activeFields.exercise}
            onChange={(_, checked) => {
              setActiveFields((prev) => ({ ...prev, exercise: checked }))
              setQuery({ exercise: checked ? exercise?.name : undefined })
            }}
          />
          <RecordExerciseSelector
            disableAddNew
            disabled={!activeFields.exercise}
            mutateRecordFields={async ({ exercise, activeModifiers }) => {
              setExercise(exercise ?? null)
              setQuery((prev) => ({ ...prev, exercise: exercise?.name }))
              if (activeModifiers) {
                setQuery((prev) => ({
                  ...prev,
                  modifier: activeModifiers,
                }))
              }
            }}
            activeModifiers={query.modifier ?? []}
            exercise={exercise}
            category={null}
            variant="outlined"
          />
        </Stack>
        <Stack direction="row">
          <Checkbox
            aria-label="modifiers-filter"
            checked={activeFields.modifiers}
            onChange={(_, checked) => {
              setActiveFields((prev) => ({ ...prev, modifiers: checked }))
              setQuery({ modifier: checked ? modifiers : undefined })
            }}
          />
          <ModifierQueryField
            matchType={query.modifierMatchType}
            disabled={!activeFields.modifiers}
            options={exercise?.modifiers || []}
            initialValue={query.modifier || []}
            updateQuery={(changes) =>
              setQuery((prev) => ({ ...prev, ...changes }))
            }
          />
        </Stack>
        <Stack direction="row">
          <Checkbox
            aria-label="set-type-filter"
            checked={activeFields.setType}
            onChange={(_, checked) => {
              setActiveFields((prev) => ({ ...prev, setType: checked }))
              setQuery((prev) => (checked ? { ...prev, ...setType } : prev))
            }}
          />
          <SetTypeSelect
            disabled={!activeFields.setType}
            variant="outlined"
            handleChange={({ setType }) =>
              setQuery((prev) => ({ ...prev, ...setType }))
            }
            units={displayFields.units}
            setType={setType}
          />
        </Stack>
        {/* don't even have the submit buttons? Just auto update? */}
        {/* <Stack direction="row">
          <Button
            variant="outlined"
            disabled={isEqual(query, query)}
            onClick={() => setQuery(query ?? {})}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            disabled={isEqual(query, query)}
            onClick={() => setQuery(query)}
          >
            Submit
          </Button>
        </Stack> */}
      </Stack>
    </>
  )
}

const FormDivider = ({ title }: { title: string }) => (
  <Divider sx={{ pb: 2 }}>{title}</Divider>
)
