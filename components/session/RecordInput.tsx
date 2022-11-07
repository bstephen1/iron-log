import { Card, CardContent } from '@mui/material'
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
import { ExerciseSelector } from '../ExerciseSelector'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import SelectFieldAutosave from '../form-fields/SelectFieldAutosave'
import SetInput from './SetInput'

interface Props {
  id: Record['_id']
}
export default function RecordInput({ id }: Props) {
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

  // const addSet = () => {
  //   const last = sets[sets.length - 1]
  //   // todo: init first set, and possibly have different behavior when adding different types of sets?
  //   updateRecord(
  //     { ...record, sets: sets.concat({ ...last, rpe: undefined }) },
  //     index
  //   )
  // }

  // todo: this exercise is a string. May want to change to an exercise ID and pull from db with Record.
  const { exercise, type, activeModifiers, sets, _id } = record
  console.log(record)

  // todo: don't show toggle or any sets until a set type is selected (or default to basic set?)
  // todo (?): maybe just the expand icon is a button instead of the whole thing? Not sure what's more natural
  // todo: select input units (if you display in kg units, you can input in lbs and it will convert)
  // todo: preserve state when changing set type?
  // todo: use carousel? https://github.com/Learus/react-material-ui-carousel
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid xs={6} md={3}>
            <ExerciseSelector
              variant="standard"
              {...{
                exercise,
                exercises,
                changeExercise: (exercise: Exercise) =>
                  updateRecordField(_id, 'exercise', exercise),
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
              onSubmit={(value) => updateRecordField(_id, 'type', value)}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <ComboBoxField
              label="Modifiers"
              options={exercise.modifiers}
              initialValue={activeModifiers}
              variant="standard"
              onSubmit={(value) =>
                updateRecordField(_id, 'activeModifiers', value)
              }
            />
          </Grid>
        </Grid>

        <Stack spacing={2} sx={{ px: 4, pt: 2 }}>
          {/* todo: unique key */}
          {sets.map((set, i) => (
            <SetInput {...set} key={i} />
          ))}
          {/* <Button onClick={addSet}>Add Set</Button> */}
        </Stack>
      </CardContent>
    </Card>
  )
}
