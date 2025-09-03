import Grid from '@mui/material/Grid'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  deleteModifier,
  updateModifierFields,
} from '../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../lib/frontend/constants'
import {
  dbDelete,
  dbUpdate,
  useExercises,
  useModifiers,
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
  const exercises = useExercises()
  const usage = getUsage(exercises.data, 'modifiers', name)
  const [_, setUrlModifier] = useQueryState('modifier')

  const updateFields = useCallback(
    async (updates: Partial<Modifier>) => {
      dbUpdate({
        optimisticKey: [QUERY_KEYS.modifiers],
        updateFunction: updateModifierFields,
        id: _id,
        updates,
        invalidates: [QUERY_KEYS.exercises],
      })
    },
    [_id]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setUrlModifier(null)
      dbDelete({
        deleteFunction: deleteModifier,
        id,
        optimisticKey: [QUERY_KEYS.modifiers],
      })
    },
    [setUrlModifier]
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
