import { type Dispatch, type SetStateAction } from 'react'
import { addModifier } from '../../../lib/backend/mongoService'
import { useModifiers } from '../../../lib/frontend/restService'
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
  const { modifiers, mutate } = useModifiers()
  return (
    <AsyncSelector
      handleChange={handleChange}
      options={modifiers}
      mutateOptions={disableAddNew ? undefined : mutate}
      value={modifier}
      label="Modifier"
      placeholder="Select or add new modifier"
      createOption={createModifier}
      addNewItem={addModifier}
    />
  )
}
