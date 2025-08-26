import { type Dispatch, type SetStateAction } from 'react'
import { useModifierAdd, useModifiers } from '../../../lib/frontend/restService'
import {
  createModifier,
  type Modifier,
} from '../../../models/AsyncSelectorOption/Modifier'
import AsyncSelector from './AsyncSelector'

interface Props {
  modifier: Modifier | null
  handleChange: Dispatch<SetStateAction<Modifier | null>>
  disableAddNew?: boolean
}
export default function ModifierSelector({
  modifier,
  disableAddNew,
  handleChange,
}: Props) {
  const modifiers = useModifiers()
  const addModifier = useModifierAdd()
  return (
    <AsyncSelector
      handleChange={handleChange}
      options={modifiers.data}
      addNewItem={disableAddNew ? undefined : addModifier}
      value={modifier}
      label="Modifier"
      placeholder="Select or add new modifier"
      createOption={createModifier}
    />
  )
}
