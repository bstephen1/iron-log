import { type ComponentProps, memo } from 'react'
import isEqual from 'react-fast-compare'
import ComboBoxField from '../../../components/form-fields/ComboBoxField'
import { useRecordUpdate } from '../../../hooks/mutation'

interface Props extends Partial<ComponentProps<typeof ComboBoxField>> {
  _id: string
  availableModifiers?: string[]
  activeModifiers: string[]
}
export default memo(function RecordModifierComboBox({
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
}, isEqual)
