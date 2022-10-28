import ClearIcon from '@mui/icons-material/Clear'
import {
  capitalize,
  Divider,
  Grow,
  IconButton,
  InputBase,
  InputBaseProps,
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
            placeholder="Empty cue (will be deleted)"
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

  return StyledInput({
    placeholder: placeholder,
    inputProps: {
      'aria-label': 'edit',
      ...register(`cues.${index}`),
    },
    endAdornment: (
      <>
        <InputButton
          isVisible={!!value}
          handleClick={() => handleDelete(index)}
          Icon={ClearIcon}
          ariaLabel="clear input"
        />
      </>
    ),
  })
}

function StyledInput(inputBaseProps: InputBaseProps) {
  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase sx={{ ml: 1, flex: 1 }} multiline {...inputBaseProps} />
    </Paper>
  )
}

interface ButtonProps {
  handleClick: any
  isVisible: boolean
  Icon: any
  ariaLabel?: string
}
function InputButton({ handleClick, isVisible, Icon, ariaLabel }: ButtonProps) {
  return (
    <Grow in={isVisible}>
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label={ariaLabel}
        onClick={handleClick}
      >
        <Icon />
      </IconButton>
    </Grow>
  )
}

/*
  placeholder
  defaultValue ? (can define in register for add; defined in parent form for listItem)
  inputProps
  button clicks: check and x buttons
    -- do we want a check on listItem? (mmm, don't think so)
    -- can conditionally render check only if onConfirm is present
*/
