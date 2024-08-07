import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { ComboBoxField } from '../../../components/form-fields/ComboBoxField'
import { UpdateFields } from '../../../lib/util'
import Record from '../../../models/Record'

interface Props extends Pick<Record, 'activeModifiers'> {
  mutateRecordFields: UpdateFields<Record>
  availableModifiers?: string[]
}
export default memo(function RecordModifierComboBox({
  mutateRecordFields,
  activeModifiers,
  availableModifiers,
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
    />
  )
}, isEqual)
