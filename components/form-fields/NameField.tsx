import { memo, useCallback } from 'react'
import isEqual from 'react-fast-compare'
import InputField from './InputField'

interface Props {
  name?: string
  handleUpdate: (updates: { name?: string }) => void
  existingNames: string[]
}
export default memo(function NameField({
  name,
  handleUpdate,
  existingNames,
}: Props) {
  return (
    <InputField
      label="Name"
      initialValue={name}
      required
      fullWidth
      handleSubmit={useCallback(
        (name: string) => handleUpdate({ name }),
        [handleUpdate]
      )}
      handleValidate={(newName) =>
        newName !== name && existingNames.find((n) => n === newName)
          ? 'Already exists!'
          : ''
      }
    />
  )
}, isEqual)
