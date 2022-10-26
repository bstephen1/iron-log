import { Button, Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Exercise from '../../models/Exercise'
import FormikTextField from '../FormikTextField'
import CuesList from './CuesList'
import ModifiersInput from './ModifiersInput'
import NameInput from './NameInput'
import NotesInput from './NotesInput'
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
    // name: Yup.string().required("Name can't be blank!")
    test: Yup.string().required("Can't be blank!"),
  })

  // todo: bring some of the smaller children into this file?
  return (
    <Formik
      initialValues={{ test: '' }}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      <Form>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Stack>
              <FormikTextField label="Testing" name="test" type="text" />
              <NameInput />
              <StatusInput />
              <ModifiersInput />
            </Stack>
          </Grid>
          <Grid xs={12} sm={6}>
            <NotesInput />
          </Grid>
          <Grid xs={12}>
            <CuesList />
          </Grid>
          <Grid xs={12}>
            <Button onClick={resetExercise} disabled={!exercise}>
              Reset
            </Button>
            <Button
              variant="contained"
              disabled={!isFormValid}
              onClick={validateAndSubmit}
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
