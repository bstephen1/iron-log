import { capitalize, Divider, Stack } from '@mui/material'
import { createContext, useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import InputAdd from './InputAddTmp'
import InputListItem from './InputListItemTmp'

// useFieldArray has to be in the parent component or it won't see any updates from the
// children, so we need an auxillary context that the children can use which still
// allows the parent to rerender on change
export const InputListFieldContext = createContext<any>(null)

interface Props {
  label?: string
  name: string
  placeholder?: string
}
export default function InputListField(props: Props) {
  const { label = capitalize(props.name), name } = props
  const {
    formState: { errors },
  } = useFormContext()
  // const error = errors[name]?.message as string
  const { fields, prepend, remove } = useFieldArray({ name })
  const watchedFields = useWatch({ name })

  useEffect(() => {
    console.log(watchedFields)
  }, [watchedFields])

  const handleAdd = (value: string) => prepend(value)
  const handleDelete = (i: number) => remove(i)

  return (
    <InputListFieldContext.Provider value={{ handleAdd, handleDelete }}>
      {/* todo: center text? outline? divider style in the middle? */}
      <Divider textAlign="center">{label}</Divider>
      {/* todo: drag n drop? */}
      <Stack spacing={2}>
        {/* todo: this is adding, but the fields don't */}
        <InputAdd handleConfirm={handleAdd} placeholder={`Add ${label}`} />
        {fields?.map((field, i) => (
          <InputListItem key={field.id} name={name} index={i} />
        ))}
      </Stack>
    </InputListFieldContext.Provider>
  )
}
