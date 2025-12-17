import { addModifier } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import { useAddMutation } from '../../../lib/frontend/data/useMutation'
import { useModifiers } from '../../../lib/frontend/data/useQuery'
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
export default function ModifierSelector({ modifier, handleChange }: Props) {
  const modifiers = useModifiers()
  const mutate = useAddMutation({
    queryKey: [QUERY_KEYS.modifiers],
    addFn: addModifier,
  })

  return (
    <AsyncSelector
      handleChange={handleChange}
      options={modifiers.data}
      addItemMutate={mutate}
      value={modifier}
      label="Modifier"
      placeholder="Select or add new modifier"
      createOption={createModifier}
    />
  )
}
