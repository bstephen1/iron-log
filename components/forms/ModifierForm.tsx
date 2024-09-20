import Grid from '@mui/material/Unstable_Grid2'
import { useQueryState } from 'next-usequerystate'
import * as yup from 'yup'
import {
  deleteModifier,
  useExercises,
  useModifiers,
} from '../../lib/frontend/restService'
import { getUsage } from '../../lib/util'
import Modifier from '../../models/AsyncSelectorOption/Modifier'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import InputField from '../form-fields/InputField'
import UsageComboBox from '../form-fields/UsageComboBox'
import ActionItems from '../form-fields/actions/ActionItems'

interface Props {
  modifier: Modifier
  handleUpdate: (updates: Partial<Modifier>) => void
}
export default function ModifierForm({
  modifier: { name, weight },
  handleUpdate,
}: Props) {
  const { modifierNames, modifiers, mutate: mutateModifiers } = useModifiers()
  const { exercises } = useExercises()
  const usage = getUsage(exercises, 'modifiers', name)
  const [_, setUrlModifier] = useQueryState('modifier')

  const handleDelete = async () => {
    await deleteModifier(name)
    setUrlModifier(null)
    mutateModifiers(modifiers?.filter((modifier) => modifier.name !== name))
  }

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
      .unique('This modifier already exists!', modifierNames),
  })

  return (
    <Grid container spacing={1} xs={12}>
      <Grid xs={12} sm={6}>
        <InputField
          label="Name"
          initialValue={name}
          required
          fullWidth
          handleSubmit={(name) => handleUpdate({ name })}
          yupValidator={yup.reach(validationSchema, 'name')}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <EquipmentWeightField
          initialValue={weight}
          handleUpdate={handleUpdate}
        />
      </Grid>
      <Grid xs={12}>
        <UsageComboBox field="modifiers" name={name} usage={usage} />
      </Grid>
      <Grid xs={12}>
        <ActionItems
          name={name}
          type="modifier"
          handleDelete={handleDelete}
          deleteDisabled={!!usage.length}
        />
      </Grid>
    </Grid>
  )
}
