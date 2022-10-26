import { Button, Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'Yup'
import { useExercises, useModifiers } from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import InputField from '../form/InputField'
import SelectField from '../form/SelectField'
import { useExerciseFormContext } from './useExerciseForm'

interface Props {
  exercise: Exercise | null
  handleSubmit?: (exercise: Exercise) => void
}
export default function ExerciseForm({ exercise }: Props) {
  const { dirtyExercise, invalidFields, resetExercise } =
    useExerciseFormContext()
  const { exercises } = useExercises()
  const { modifiers } = useModifiers()

  // any field with a reason string is invalid
  const hasNoInvalidFields = Object.values(invalidFields).every(
    (value) => !value
  )
  // todo: unchanged fields
  const hasNoUnchangedFields = true
  const isFormValid =
    dirtyExercise && hasNoInvalidFields && hasNoUnchangedFields

  // todo: validate (drop empty cues)
  function validateAndSubmit() {
    // isFormValid && handleSubmit(dirtyExercise)
  }

  // Yup.addMethod(Yup.array, 'unique', function (message, mapper = a => a) {
  //   return this.test('unique', message, function (list) {
  //     return list.length === new Set(list.map(mapper)).size;
  //   });
  // });

  const validationSchema = Yup.object({
    name: Yup.string().required("Name can't be blank!"),
    status: Yup.string(),
    modifiers: Yup.array(),
    notes: Yup.string(),
    cues: Yup.array(),
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<any> = (data: any) => {
    console.log(data)
  }

  // useEffect(() => {
  //   console.log(errors)
  // }, [errors])

  // console.log(watch('name'))

  // todo: bring some of the smaller children into this file?
  return (
    // <Formik
    //   initialValues={{
    //     name: '',
    //     notes: '',
    //     status: '',
    //     modifiers: ['amrap'],
    //     cues: ['cue1'],
    //   }}
    //   validationSchema={validationSchema}
    //   onSubmit={(values, props) => {
    //     console.log('submit')
    //     console.log(values)
    //   }}
    //   onReset={(_, props) => {
    //     console.log('reset')
    //     props.resetForm()
    //   }}
    // >
    // {/* noValidate disables just the default browser validation popup */}
    // <Form noValidate>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <Stack>
            <InputField
              label="Name"
              name="name"
              register={register}
              error={errors.name?.message}
              required // all this does is put an asterisk at the end of the label...
              fullWidth
            />
            <SelectField
              label="Status"
              name="status"
              register={register}
              options={Object.values(ExerciseStatus)}
              fullWidth
            />
            {/* <FormikAsyncComboBoxField
                  label="Valid Modifiers"
                  name="modifiers"
                  fullWidth
                  options={modifiers?.map((modifier) => modifier.name)}
                /> */}
          </Stack>
        </Grid>
        <Grid xs={12} sm={6}>
          <InputField
            label="Notes"
            name="notes"
            register={register}
            // errors={errors.notes}
            multiline
            fullWidth
          />
        </Grid>
        <Grid xs={12}>
          {/* <FormikInputListField
                label="Cues"
                name="cues"
                placeholder="Add Cue"
              /> */}
        </Grid>
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
    </form>
    // {/* </Form> */}
    // </Formik>
  )
}
