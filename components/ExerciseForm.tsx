import Grid from '@mui/system/Unstable_Grid'
import * as yup from 'yup'
import {
  useCategories,
  useExercises,
  useModifiers,
} from '../lib/frontend/restService'
import { useNames } from '../lib/util'
import Exercise from '../models/Exercise'
import { ExerciseStatus } from '../models/ExerciseStatus'
import { ComboBoxField } from './form-fields/ComboBoxField'
import InputField from './form-fields/InputField'
import NotesList from './form-fields/NotesList'
import SelectFieldAutosave from './form-fields/SelectFieldAutosave'

interface Props {
  exercise: Exercise
  handleUpdate: (updates: Partial<Exercise>) => void
}
export default function ExerciseForm({ exercise, handleUpdate }: Props) {
  const { modifiers } = useModifiers()
  const { categories } = useCategories()
  const { exercises } = useExercises({})

  const modifierNames = useNames(modifiers)
  const exerciseNames = useNames(exercises)
  const categoryNames = useNames(categories)

  // todo: validate (drop empty notes)

  // This method requires using anonymous functions rather than arrow functions (using "function" keyword)
  // because arrow functions preserve the context of "this", but Yup needs the nested "this" from addMethod.
  yup.addMethod(
    yup.string,
    'unique',
    function (message: string, list: string[]) {
      return this.test('unique', message, function (value) {
        return !!value && list.length !== new Set(list.concat(value)).size
      })
    }
  )

  // todo: can we enumerate the Exercise fields instead of hardcoding?
  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Must have a name')
      // todo: ts isn't recognizing that addMethod() added this. Possible solutions: https://github.com/jquense/yup/issues/312
      // @ts-ignore
      .unique('This exercise already exists!', exerciseNames),
    status: yup.string().required('Must have a status'),
  })

  return (
    <Grid container spacing={1} xs={12}>
      <Grid xs={12} sm={6}>
        {/* todo: would be great to consolidate this somehow. Maybe have a "name" for the inputFields.
            Export the schema and have the hook pull it in?  */}
        <InputField
          label="Name"
          initialValue={exercise.name}
          required
          fullWidth
          handleSubmit={(name) => handleUpdate({ name })}
          yupValidator={yup.reach(validationSchema, 'name')}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <SelectFieldAutosave
          label="Status"
          options={Object.values(ExerciseStatus)}
          initialValue={exercise.status}
          required
          fullWidth
          yupValidator={yup.reach(validationSchema, 'status')}
          handleSubmit={(status) => handleUpdate({ status })}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Categories"
          initialValue={exercise.categories}
          options={categoryNames}
          textFieldProps={{ helperText: ' ' }}
          handleSubmit={(categories) => handleUpdate({ categories })}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Modifiers"
          initialValue={exercise.modifiers}
          options={modifierNames}
          textFieldProps={{ helperText: ' ' }}
          handleSubmit={(modifiers) => handleUpdate({ modifiers })}
        />
      </Grid>
      <Grid xs={12}>
        <NotesList
          label="Notes"
          notes={exercise.notes}
          options={exercise.modifiers}
          handleSubmit={(notes) => handleUpdate({ notes })}
          multiple
        />
      </Grid>
    </Grid>
  )
}
