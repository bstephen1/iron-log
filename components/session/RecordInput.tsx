import { Delete } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material'
import { Stack } from '@mui/system'
import Grid from '@mui/system/Unstable_Grid'
import {
  updateRecordField,
  useExercises,
  useRecord,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import Record from '../../models/Record'
import { SetType } from '../../models/SetType'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import { ExerciseSelector } from '../form-fields/ExerciseSelector'
import SelectFieldAutosave from '../form-fields/SelectFieldAutosave'
import StandardSetInput from './sets/StandardSetInput'

interface Props {
  id: Record['_id']
  deleteRecord: (id: string) => void
}
export default function RecordInput({ id, deleteRecord }: Props) {
  const { record, isError, mutate } = useRecord(id)
  const { exercises } = useExercises({ status: ExerciseStatus.ACTIVE }) // SWR caches this, so it won't need to call the API every render

  if (isError) {
    console.error('Could not fetch record!')
    return <></>
  }

  // todo: skeleton?
  if (!record || !exercises) {
    return <></>
  }

  // define after null checks so record must exist
  const { exercise, type, activeModifiers, sets, _id } = record

  const addSet = () => {
    const last = sets[sets.length - 1] ?? { primary: 0, secondary: 0 }
    // todo: init first set, and possibly have different behavior when adding different types of sets?
    const newSet = { ...last, effort: undefined }
    updateRecordField(_id, `sets.${sets.length}`, newSet)
    mutate({ ...record, sets: sets.concat(newSet) })
  }

  const handleFieldChange = <T extends keyof Record>(
    field: T,
    value: Record[T]
  ) => {
    updateRecordField(_id, field, value)
    mutate({ ...record, [field]: value })
  }

  const handleSetChange = (setField, value, i) => {
    updateRecordField(_id, `sets.${i}.${setField}`, value)
    const newSets = [...record.sets]
    newSets[i][setField] = value
    mutate({ ...record, sets: newSets })
  }

  const handleExerciseChange = (newExercise: Exercise) => {
    const remainingModifiers = activeModifiers.filter((modifier) =>
      newExercise.modifiers.some((exercise) => exercise === modifier)
    )
    console.log(newExercise)
    console.log(remainingModifiers)
    updateRecordField(_id, 'exercise', newExercise)
    updateRecordField(_id, 'activeModifiers', remainingModifiers)
    mutate({
      ...record,
      exercise: newExercise,
      activeModifiers: remainingModifiers,
    })
  }

  // todo: select input units (if you display in kg units, you can input in lbs and it will convert)
  // todo: preserve state when changing set type?
  // todo: use carousel? https://github.com/Learus/react-material-ui-carousel
  // todo: add Category to Record so it persists
  return (
    <Card elevation={3}>
      <CardContent>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid xs={6} md={3}>
            <ExerciseSelector
              variant="standard"
              {...{
                exercise,
                exercises,
                changeExercise: handleExerciseChange,
              }}
            />
          </Grid>
          <Grid xs={6} md={3}>
            <SelectFieldAutosave
              label="Set Type"
              initialValue={type}
              fullWidth
              variant="standard"
              options={Object.values(SetType)}
              onSubmit={(value) => handleFieldChange('type', value)}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <ComboBoxField
              label="Modifiers"
              options={exercise.modifiers}
              initialValue={activeModifiers}
              variant="standard"
              onSubmit={(value: string[]) =>
                handleFieldChange('activeModifiers', value)
              }
            />
          </Grid>
        </Grid>

        <Box sx={{ px: 4, py: 2 }}>
          {/* todo: unique key */}
          {sets.map((set, i) => (
            <StandardSetInput
              {...set}
              type={record.type}
              units={{ primary: 'kg' }}
              key={i}
              onSubmit={(setField, value) =>
                handleSetChange(setField, value, i)
              }
            />
          ))}
        </Box>
      </CardContent>
      <CardActions
        sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 2 }}
      >
        <Button onClick={() => deleteRecord(_id)} color="error">
          Delete Record
        </Button>
        <Button onClick={addSet} variant="contained">
          Add Set
        </Button>
      </CardActions>
    </Card>
  )
}
