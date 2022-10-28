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

  return (
    <OutlinedInput
      placeholder={placeholder}
      inputProps={{
        'aria-label': 'edit',
        ...register(`cues.${index}`),
      }}
      endAdornment={
        <>
          <AdornmentButton
            isVisible={!!value}
            handleClick={() => handleDelete(index)}
            ariaLabel="clear input"
          >
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}

interface AddProps {
  placeholder?: string
  handleAdd: Function
}
function InputAdd({ placeholder, handleAdd }: AddProps) {
  const { register, handleSubmit, watch, reset } = useForm()
  const addName = 'add'
  const isEmpty = !watch(addName)
  const resetAdd = () => {
    reset((fields) => ({
      ...fields,
      add: '',
    }))
  }
  const onSubmit = (fields: FieldValues) => {
    console.log(fields)
    handleAdd(fields.add)
    resetAdd()
  }

  return (
    <OutlinedInput
      placeholder={placeholder}
      defaultValue=""
      inputProps={{ ...register('add') }}
      endAdornment={
        <>
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={handleSubmit(onSubmit)}
            ariaLabel="add cue"
          >
            <CheckIcon />
          </AdornmentButton>
          {/* todo: this actually adds to list, bc onBlur */}
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={resetAdd}
            ariaLabel="clear input"
          >
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}

interface ButtonProps {
  handleClick: any
  isVisible: boolean
  ariaLabel?: string
  children?: JSX.Element
}
function AdornmentButton({
  handleClick,
  isVisible,
  ariaLabel,
  children,
}: ButtonProps) {
  return (
    <Grow in={isVisible}>
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label={ariaLabel}
        onClick={handleClick}
      >
        {children}
      </IconButton>
    </Grow>
  )
}
