import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  deleteModifier,
  useExercises,
  useModifiers,
} from '../../lib/frontend/restService'
import { getUsage } from '../../lib/util'
import { Modifier } from '../../models/AsyncSelectorOption/Modifier'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import NameField from '../form-fields/NameField'
import UsageComboBox from '../form-fields/UsageComboBox'
import ActionItems from '../form-fields/actions/ActionItems'

interface Props {
  modifier: Modifier
  handleUpdate: (id: string, updates: Partial<Modifier>) => void
}
export default function ModifierForm({
  modifier: { name, weight, _id },
  handleUpdate,
}: Props) {
  const { modifierNames, mutate: mutateModifiers } = useModifiers()
  const { exercises } = useExercises()
  const usage = getUsage(exercises, 'modifiers', name)
  const [_, setUrlModifier] = useQueryState('modifier')

  const updateFields = useCallback(
    (updates: Partial<Modifier>) => handleUpdate(_id, updates),
    [_id, handleUpdate]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteModifier(id)
      setUrlModifier(null)
      mutateModifiers((cur) => cur?.filter((modifier) => modifier._id !== id))
    },
    [mutateModifiers, setUrlModifier]
  )

  return (
    <Grid container spacing={1} size={12}>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <NameField
          name={name}
          handleUpdate={updateFields}
          options={modifierNames}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <EquipmentWeightField weight={weight} handleUpdate={updateFields} />
      </Grid>
      <Grid size={12}>
        <UsageComboBox field="modifiers" name={name} usage={usage} />
      </Grid>
      <Grid size={12}>
        <ActionItems
          id={_id}
          name={name}
          type="modifier"
          handleDelete={handleDelete}
          deleteDisabled={!!usage.length}
        />
      </Grid>
    </Grid>
  )
}
