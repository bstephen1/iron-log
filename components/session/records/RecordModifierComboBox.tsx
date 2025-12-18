import type { ComponentProps } from 'react'
import ComboBoxField from '../../../components/form-fields/ComboBoxField'
import { useRecordUpdate } from './useRecordUpdate'

interface Props extends Partial<ComponentProps<typeof ComboBoxField>> {
  _id: string
  availableModifiers?: string[]
  activeModifiers: string[]
}
export default function RecordModifierComboBox({
  activeModifiers,
  availableModifiers,
  _id,
  ...comboBoxFieldProps
}: Props) {
  const updateRecord = useRecordUpdate(_id)

  return (
    <ComboBoxField
      label="Modifiers"
      options={availableModifiers?.sort()}
      initialValue={activeModifiers}
      variant="standard"
      helperText=""
      handleSubmit={(value: string[]) =>
        updateRecord({ activeModifiers: value })
      }
      {...comboBoxFieldProps}
    />
  )
}
