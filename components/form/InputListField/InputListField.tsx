import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import {
  capitalize,
  Divider,
  Grow,
  IconButton,
  OutlinedInput,
  Stack,
} from '@mui/material'
import {
  FieldValues,
  useController,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'
import AddItemInput from './AddItemInput'
import ListItemInput from './ListItemInput'

interface Props {
  label?: string
  name: string
  placeholder?: string
}
export default function InputListField(props: Props) {
  const { label = capitalize(props.name), name } = props
  const { fields, prepend, remove } = useFieldArray({ name })

  // we need to save these as functions in the parent component
  // or the list won't be able to properly rerender on change
  const handleAdd = (value: string) => prepend(value)
  const handleDelete = (i: number) => remove(i)

  return (
    <>
      {/* todo: center text? outline? divider style in the middle? */}
      <Divider textAlign="center">{label}</Divider>
      {/* todo: drag n drop? */}
      <Stack spacing={2}>
        {/* these started out multiline but that was creating weird padding. Revisit if multiline is actually needed */}
        <AddItemInput handleAdd={handleAdd} placeholder={`Add ${label}`} />
        {fields?.map((field, i) => (
          <ListItemInput
            key={field.id}
            handleDelete={handleDelete}
            name={name}
            index={i}
            placeholder="Empty cue (will be deleted)"
          />
        ))}
      </Stack>
    </>
  )
}
