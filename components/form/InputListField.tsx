import ClearIcon from '@mui/icons-material/Clear'
import {
  capitalize,
  Divider,
  Grow,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from '@mui/material'
import { useEffect } from 'react'
import {
  useController,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import InputAdd from './InputAddTmp'
import InputBaseStyle from './InputListItemTmp'

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

interface ListItemProps {
  name: string
  index: number
  handleDelete: Function
  placeholder?: string
}
function InputListItem(props: ListItemProps) {
  const { placeholder = '', index, name, handleDelete } = props
  const { register } = useFormContext()
  const {
    field,
    fieldState: { isDirty },
  } = useController({ name: `${name}.${index}` })
  let { value, onBlur } = field

  // thinking instead of this, try to extract common fields and set up the differences as individual props
  // eg, extract inputProps values and pass them in as props
  return StyledInput({
    placeholder: placeholder,
    inputProps: {
      'aria-label': 'edit',
      ...register(`cues.${index}`),
    },
    endAdornment: (
      <>
        <Grow in={!!value}>
          <IconButton
            type="button"
            sx={{ p: '10px' }}
            aria-label="clear input"
            onClick={() => {
              handleDelete(index)
            }}
          >
            <ClearIcon />
          </IconButton>
        </Grow>
      </>
    ),
  })
}

function StyledInput(props: any) {
  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase sx={{ ml: 1, flex: 1 }} multiline {...props} />
    </Paper>
  )
}
