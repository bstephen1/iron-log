import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useExercises, useModifiers } from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import AsyncComboBoxField from '../form/AsyncComboBoxField'
import InputField from '../form/InputField'
import InputListField from '../form/InputListField/InputListField'
import SelectField from '../form/SelectField'

interface Props {
  exercise: Exercise | null
  handleSubmit?: (exercise: Exercise) => void
}
export default function ExerciseForm({ exercise }: Props) {
  const { exercises } = useExercises()
  const { modifiers } = useModifiers()
  const modifierNames = modifiers?.map((modifier) => modifier.name) || []

  // todo: validate (drop empty cues)

  // yup.addMethod(yup.array, 'unique', function (message, mapper = a => a) {
  //   return this.test('unique', message, function (list) {
  //     return list.length === new Set(list.map(mapper)).size;
  //   });
  // });

  const validationSchema = yup.object({
    name: yup.string().required("Name can't be blank!"),
    status: yup.string(),
    modifiers: yup.array(),
    notes: yup.string(),
    cues: yup.array(),
  })

  const methods = useForm({
    mode: 'onBlur', // todo: this is weird; think I want onChange but only after first onBlur instead
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: 'I am name',
      modifiers: ['band'],
      cues: ['test1', 'another', 'yat'],
    },
  })

  const onSubmit: SubmitHandler<any> = (data: any) => {
    console.log(data.cues)
  }

  // useEffect(() => {
  //   console.log(errors)
  // }, [errors])

  // console.log(watch('name'))

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Stack>
              {/* register === uncontrolled; control === controlled */}
              <InputField
                name="name"
                required // all this does is put an asterisk at the end of the label...
                fullWidth
              />
              <SelectField
                name="status"
                options={Object.values(ExerciseStatus)}
                fullWidth
              />
              <AsyncComboBoxField
                label="Valid Modifiers"
                name="modifiers"
                fullWidth
                options={modifierNames}
              />
            </Stack>
          </Grid>
          <Grid xs={12} sm={6}>
            <InputField
              name="notes"
              // errors={errors.notes}
              multiline
              fullWidth
            />
          </Grid>
          <Grid xs={12}>
            <InputListField
              name="cues"
              // placeholder="Add Cue"
            />
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
    </FormProvider>
  )
}
