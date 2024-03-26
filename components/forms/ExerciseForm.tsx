import { InputAdornment } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import * as yup from 'yup'
import {
  useCategories,
  useExercises,
  useModifiers,
} from '../../lib/frontend/restService'
import Exercise from '../../models/AsyncSelectorOption/Exercise'
import AttributeCheckboxes from '../form-fields/AttributeCheckboxes'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import InputField from '../form-fields/InputField'
import NotesList from '../form-fields/NotesList'
import NumericFieldAutosave from '../form-fields/NumericFieldAutosave'
import StatusSelect from '../form-fields/StatusSelect'

interface Props {
  exercise: Exercise
  handleUpdate: (updates: Partial<Exercise>) => void
}
export default function ExerciseForm({ exercise, handleUpdate }: Props) {
  const { activeStatusModifiers } = useModifiers()
  const { activeStatusCategories } = useCategories()
  const { exerciseNames } = useExercises()

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
    },
  )

  // todo: can we enumerate the Exercise fields instead of hardcoding?
  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Must have a name')
      // todo: ts isn't recognizing that addMethod() added this. Possible solutions: https://github.com/jquense/yup/issues/312
      // @ts-ignore
      .unique('This exercise already exists!', exerciseNames),
  })

  return (
    <Grid container spacing={1} xs={12}>
      <Grid xs={12}>
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
        <StatusSelect
          initialValue={exercise.status}
          handleSubmit={(status) => handleUpdate({ status })}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <NumericFieldAutosave
          label="Equipment weight"
          initialValue={exercise.weight}
          handleSubmit={(weight) => handleUpdate({ weight })}
          fullWidth
          variant="outlined"
          defaultHelperText=" "
          // todo: might want to make this selectable between lbs/kg
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Categories"
          initialValue={exercise.categories}
          options={activeStatusCategories}
          textFieldProps={{ helperText: ' ' }}
          handleSubmit={(categories) => handleUpdate({ categories })}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Modifiers"
          initialValue={exercise.modifiers}
          options={activeStatusModifiers}
          textFieldProps={{ helperText: ' ' }}
          handleSubmit={(modifiers) => handleUpdate({ modifiers })}
        />
      </Grid>
      <Grid xs={12}>
        <AttributeCheckboxes
          attributes={exercise.attributes}
          handleSubmit={(attributes) => handleUpdate({ attributes })}
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
