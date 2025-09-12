import { addModifier } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import { useAddMutation, useModifiers } from '../../../lib/frontend/restService'
import {
  createModifier,
  type Modifier,
} from '../../../models/AsyncSelectorOption/Modifier'
import AsyncSelector from './AsyncSelector'

interface Props {
  modifier: Modifier | null
  handleChange: (modifier: Modifier | null) => void
  disableAddNew?: boolean
}
export default function ModifierSelector({
  modifier,
  disableAddNew,
  handleChange,
}: Props) {
  const modifiers = useModifiers()
  const mutate = useAddMutation({
    queryKey: [QUERY_KEYS.modifiers],
    addFn: addModifier,
  })

  return (
    <AsyncSelector
      handleChange={handleChange}
      options={modifiers.data}
      addItemMutate={disableAddNew ? undefined : mutate}
      value={modifier}
      label="Modifier"
      placeholder="Select or add new modifier"
      createOption={createModifier}
    />
  )
}
