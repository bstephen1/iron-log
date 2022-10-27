import { capitalize, Divider, Stack } from '@mui/material'
import { createContext, useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import InputAdd from './InputAddTmp'
import InputListItem from './InputListItemTmp'

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
    <>
      {/* todo: center text? outline? divider style in the middle? */}
      <Divider textAlign="center">{label}</Divider>
      {/* todo: drag n drop? */}
      <Stack spacing={2}>
        {/* todo: this is adding, but the fields don't */}
        <InputAdd handleAdd={handleAdd} placeholder={`Add ${label}`} />
        {fields?.map((field, i) => (
          <InputListItem
            key={field.id}
            handleDelete={handleDelete}
            name={name}
            index={i}
            placeholder="Delete empty cue"
          />
        ))}
      </Stack>
    </>
  )
}
