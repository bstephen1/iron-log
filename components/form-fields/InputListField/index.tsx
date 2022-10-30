import { capitalize, Divider, Stack } from '@mui/material'
import { useFieldArray } from 'react-hook-form'
import AddItemInput from './AddItemInput'
import ListItemInput from './ListItemInput'

interface Props {
  label?: string
  addItemPlaceholder?: string
  listItemPlaceholder?: string
  handleSubmit: any
  values: string[]
}
export default function InputListField(props: Props) {
  const {
    label,
    addItemPlaceholder,
    listItemPlaceholder,
    handleSubmit,
    values,
  } = props
  // const { fields, prepend, remove } = useFieldArray({ name })

  // we need to save these as functions in the parent component
  // or the list won't be able to properly rerender on change
  const handleAdd = (value: string) => handleSubmit([value, ...values])
  const handleDelete = (i: number) => remove(i)

  return (
    <>
      {/* todo: center text? outline? divider style in the middle? */}
      {/* todo: style divider line w/ theme color? (see dad) */}
      <Divider textAlign="center" sx={{ pb: 2 }}>
        {label}
      </Divider>
      {/* todo: drag n drop? */}
      <Stack spacing={2}>
        {/* these started out multiline but that was creating weird padding. Revisit if multiline is actually needed */}
        <AddItemInput handleAdd={handleAdd} placeholder={addItemPlaceholder} />
        {/* {fields?.map((field, i) => (
          <ListItemInput
            key={field.id}
            handleDelete={handleDelete}
            name={name}
            index={i}
            placeholder={listItemPlaceholder}
          />
        ))} */}
      </Stack>
    </>
  )
}
