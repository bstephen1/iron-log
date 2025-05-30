import { type ComponentProps, memo } from 'react'
import isEqual from 'react-fast-compare'
import ComboBoxField from '../../../components/form-fields/ComboBoxField'
import { type UpdateFields } from '../../../lib/util'
import { type Record } from '../../../models/Record'

interface Props extends Partial<ComponentProps<typeof ComboBoxField>> {
  mutateRecordFields: UpdateFields<Record>
  availableModifiers?: string[]
  activeModifiers: string[]
}
export default memo(function RecordModifierComboBox({
  mutateRecordFields,
  activeModifiers,
  availableModifiers,
  ...comboBoxFieldProps
}: Props) {
  return (
    <ComboBoxField
      label="Modifiers"
      options={availableModifiers?.sort()}
      initialValue={activeModifiers}
      variant="standard"
      helperText=""
      handleSubmit={(value: string[]) =>
        mutateRecordFields({ activeModifiers: value })
      }
      {...comboBoxFieldProps}
    />
  )
}, isEqual)
