import { memo, useCallback } from 'react'
import isEqual from 'react-fast-compare'
import { z } from 'zod'
import InputField from './InputField'

interface Props {
  name?: string
  handleUpdate: (updates: { name?: string }) => void
  options: string[]
}
export default memo(function NameField({ name, handleUpdate, options }: Props) {
  return (
    <InputField
      label="Name"
      initialValue={name}
      required
      fullWidth
      handleSubmit={useCallback(
        (name) => handleUpdate({ name }),
        [handleUpdate]
      )}
      valueSchema={z
        .string()
        .min(1, 'Must have a name')
        .refine(
          (name) => options.length !== new Set(options.concat(name)).size,
          'Already exists!'
        )}
    />
  )
}, isEqual)
