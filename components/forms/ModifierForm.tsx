import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  deleteModifier,
  updateModifierFields,
} from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import {
  useDeleteMutation,
  useExercises,
  useModifiers,
  useUpdateMutation,
} from '../../lib/frontend/restService'
import { getUsage } from '../../lib/frontend/usage'
import type { Modifier } from '../../models/AsyncSelectorOption/Modifier'
import ActionItems from '../form-fields/actions/ActionItems'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import NameField from '../form-fields/NameField'
import UsageComboBox from '../form-fields/UsageComboBox'

interface Props {
  modifier: Modifier
}
export default function ModifierForm({
  modifier: { name, weight, _id },
}: Props) {
  const modifiers = useModifiers()
  const exercises = useExercises()
  const usage = getUsage(exercises.data, 'modifiers', name)
  const [_, setUrlModifier] = useQueryState('modifier')
  const deleteModifierMutate = useDeleteMutation({
    queryKey: [QUERY_KEYS.modifiers],
    deleteFn: deleteModifier,
  })
  const updateModifierMutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.modifiers],
    updateFn: updateModifierFields,
    invalidates: [QUERY_KEYS.exercises],
  })

  const updateFields = useCallback(
    async (updates: Partial<Modifier>) => {
      updateModifierMutate({ _id, updates })
    },
    [_id, updateModifierMutate]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      deleteModifierMutate(id)
      await setUrlModifier(null)
    },
    [deleteModifierMutate, setUrlModifier]
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
          existingNames={modifiers.names}
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
