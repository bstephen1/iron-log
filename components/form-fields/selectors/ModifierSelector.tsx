import { type Dispatch, type SetStateAction } from 'react'
import { addModifier } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
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
  const modifiers = useModifiers()
  return (
    <AsyncSelector
      handleChange={handleChange}
      options={modifiers.data}
      dbAddProps={
        disableAddNew
          ? undefined
          : {
              addFunction: addModifier,
              optimisticKey: [QUERY_KEYS.modifiers],
            }
      }
      value={modifier}
      label="Modifier"
      placeholder="Select or add new modifier"
      createOption={createModifier}
    />
  )
}
