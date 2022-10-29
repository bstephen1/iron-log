import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useModifiers } from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import InputFieldAutosave from '../form-fields/InputFieldAutosave'
import SelectFieldAutosave from '../form-fields/SelectFieldAutosave'

interface Props {
  exercise: Exercise | null
  handleSubmit: (exercise: Exercise) => void
}
export default function ExerciseForm({ exercise, handleSubmit }: Props) {
  // todo: find a better way to set up default values?
  const { _id, ...exerciseKeyless } = exercise || {
    _id: null,
    name: '',
    status: '',
    notes: '',
    validModifiers: [],
    cues: [],
  }
  const { modifiers } = useModifiers()
  const modifierNames = modifiers?.map((modifier) => modifier.name) || []

  // todo: validate (drop empty cues)

  // yup.addMethod(yup.array, 'unique', function (message, mapper = a => a) {
  //   return this.test('unique', message, function (list) {
  //     return list.length === new Set(list.map(mapper)).size;
  //   });
  // });

  // todo: disable form when exercise is null

  // todo: define react form type ?

  // todo: status isn't populating

  // todo: can we enumerate the Exercise fields instead of hardcoding?
  const validationSchema = yup.object({
    name: yup.string().required('Must have a name'), // todo: validate uniqueness
    status: yup.string().required('Must have a status'),
    notes: yup
      .string()
      .required("y'all better have notes")
      .max(20, 'way too long bro'),
    validModifiers: yup.array(),
    cues: yup.array(),
  })

  const test = { name: 'ok' }
  const test2 = { name: '' }

  // validate a single field from a form
  // yup.reach(validationSchema, 'name').validate('name')
  // yup.reach(validationSchema, 'name').validate('')

  const methods = useForm({
    mode: 'onBlur', // todo: this is weird; think I want onChange but only after first onBlur instead
    resolver: yupResolver(validationSchema),
    defaultValues: { ...exerciseKeyless },
  })

  const onSubmit: SubmitHandler<any> = (data: any) => {
    console.log(data)
    // handleSubmit({ _id, ...data } as Exercise)
  }

  const handleUpdate = <T extends keyof Exercise>(
    field: T,
    value: Exercise[T]
  ) => {
    if (!exercise) return
    console.log(field)
    console.log(value)
    // const newExercise = { ...exercise, [field]: value }
    // updateExerciseField(exercise, field, value)
    // mutate(newExercise)
  }

  useEffect(() => {
    console.log('resetting')
    methods.reset({ ...exerciseKeyless })
  }, [exercise]) // todo: this CAN'T be exerciseKeyless; it renders infinitely. Maybe needs a useRef

  return (
    // <FormProvider {...methods}>
    //   <form onSubmit={methods.handleSubmit(onSubmit)}>
    <Grid container spacing={2}>
      <Grid xs={12} sm={6}>
        <Stack>
          {/* register === uncontrolled; control === controlled */}
          {/* <InputField
            name="name"
            required // all this does is put an asterisk at the end of the label...
            fullWidth
          />
          <SelectField
            name="status"
            options={Object.values(ExerciseStatus)}
            fullWidth
          /> */}
          <SelectFieldAutosave
            label="Status"
            options={Object.values(ExerciseStatus)}
            initialValue={exercise?.status}
            fullWidth
            handleSubmit={(value) =>
              handleUpdate('status', value as ExerciseStatus)
            }
          />
          {/* <AsyncComboBoxField
            label="Valid Modifiers"
            name="validModifiers"
            fullWidth
            options={modifierNames}
          /> */}
        </Stack>
      </Grid>
      <Grid xs={12} sm={6}>
        {/* <InputField
          name="notes"
          // errors={errors.notes}
          multiline
          fullWidth
        /> */}
        <InputFieldAutosave
          label="Notes"
          defaultValue={exercise?.notes}
          fullWidth
          onSubmit={(value) => handleUpdate('notes', value)}
          validator={yup.reach(validationSchema, 'notes')}
        />
      </Grid>
      {/* <Grid xs={12}>
        <InputListField
          name="cues"
          addItemPlaceholder="Add Cue"
          listItemPlaceholder="Empty Cue (will be deleted)"
        />
      </Grid> */}
      <Grid xs={12}>
        <Button type="reset">Reset</Button>
        <Button
          variant="contained"
          // disabled={!isFormValid}
          type="submit"
        >
          Save
        </Button>
        {/* todo: put a warning / error icon if there is warning (no changes) or error (invalid changes)? */}
      </Grid>
    </Grid>
    //   </form>
    // </FormProvider>
  )
}
