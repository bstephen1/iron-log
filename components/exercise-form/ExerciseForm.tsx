import { Button, Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Exercise from '../../models/Exercise'
import FormikTextField from '../FormikTextField'
import CuesList from './CuesList'
import ModifiersInput from './ModifiersInput'
import StatusInput from './StatusInput'
import { useExerciseFormContext } from './useExerciseForm'

interface Props {
  exercise: Exercise | null
  handleSubmit: (exercise: Exercise) => void
}
export default function ExerciseForm({ exercise, handleSubmit }: Props) {
  const { dirtyExercise, invalidFields, resetExercise } =
    useExerciseFormContext()

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
    isFormValid && handleSubmit(dirtyExercise)
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name can't be blank!"),
    notes: Yup.string(),
  })

  // todo: bring some of the smaller children into this file?
  return (
    <Formik
      initialValues={{ name: 'test', notes: 'hello' }}
      validationSchema={validationSchema}
      onSubmit={() => {
        console.log('submit')
      }}
      onReset={() => {
        console.log('reset')
      }}
    >
      {/* noValidate disables just the default browser validation popup */}
      <Form noValidate>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Stack>
              <FormikTextField label="Name" name="name" required />
              <StatusInput />
              <ModifiersInput />
            </Stack>
          </Grid>
          <Grid xs={12} sm={6}>
            <FormikTextField label="Notes" name="notes" multiline />
          </Grid>
          <Grid xs={12}>
            <CuesList />
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
      </Form>
    </Formik>
  )
}
