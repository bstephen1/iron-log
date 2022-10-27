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
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncComboBoxField from '../form/AsyncComboBoxField'

interface Props {
  exercise: Exercise | null
  handleSubmit?: (exercise: Exercise) => void
}
export default function ExerciseForm({ exercise }: Props) {
  const { exercises } = useExercises()
  const { modifiers } = useModifiers()
  const modifierNames = modifiers?.map((modifier) => modifier.name) || []

  // todo: validate (drop empty cues)

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
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur', // todo: this is weird; think I want onChange but only after first onBlur instead
    resolver: yupResolver(validationSchema),
    defaultValues: { modifiers: ['band'] },
  })

  const onSubmit: SubmitHandler<any> = (data: any) => {
    console.log(data)
  }

  // useEffect(() => {
  //   console.log(errors)
  // }, [errors])

  // console.log(watch('name'))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <Stack>
            {/* register === uncontrolled; control === controlled */}
            <InputField
              label="Name"
              name="name"
              register={register}
              error={errors.name?.message} // todo: think this is because form type isn't defined
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
            <AsyncComboBoxField
              label="Valid Modifiers"
              name="modifiers"
              control={control}
              fullWidth
              options={modifierNames}
            />
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
  )
}
