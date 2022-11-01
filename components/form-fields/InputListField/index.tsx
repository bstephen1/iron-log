import { Divider, Stack } from '@mui/material'
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
    values,
    addItemPlaceholder,
    listItemPlaceholder,
    handleSubmit,
  } = props

  // we need to save these as functions in the parent component
  // or the list won't be able to properly rerender on change
  const handleAdd = (value: string) => handleSubmit([value, ...values])
  const handleDelete = (i: number) => {
    handleSubmit(values.slice(0, i).concat(values.slice(i + 1)))
  }
  const handleUpdate = (i: number, value: string) => {
    handleSubmit(
      values
        .slice(0, i)
        .concat(value)
        .concat(values.slice(i + 1))
    )
  }

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
        <AddItemInput
          handleAdd={handleAdd}
          placeholder={addItemPlaceholder}
          disabled={props.values == null}
        />
        {values?.map((value, i) => (
          <ListItemInput
            key={i}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            index={i}
            defaultValue={value}
            placeholder={listItemPlaceholder}
          />
        ))}
      </Stack>
    </>
  )
}
