import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  useExercises,
  useModifierDelete,
  useModifiers,
  useModifierUpdate,
} from '../../lib/frontend/restService'
import { getUsage } from '../../lib/util'
import { type Modifier } from '../../models/AsyncSelectorOption/Modifier'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import NameField from '../form-fields/NameField'
import UsageComboBox from '../form-fields/UsageComboBox'
import ActionItems from '../form-fields/actions/ActionItems'

interface Props {
  modifier: Modifier
}
export default function ModifierForm({
  modifier: { name, weight, _id },
}: Props) {
  const modifiers = useModifiers()
  const updateModifier = useModifierUpdate()
  const deleteModifier = useModifierDelete()
  const exercises = useExercises()
  const usage = getUsage(exercises.data, 'modifiers', name)
  const [_, setUrlModifier] = useQueryState('modifier')

  const updateFields = useCallback(
    async (updates: Partial<Modifier>) => {
      updateModifier({ _id, updates })
    },
    [_id, updateModifier]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setUrlModifier(null)
      deleteModifier(id)
    },
    [deleteModifier, setUrlModifier]
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
          options={modifiers.names}
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
