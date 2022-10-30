import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import useField from '../useField'
import AdornmentButton from './AdornmentButton'

interface Props {
  defaultValue: string
  index: number
  handleDelete: (index: number) => void
  handleUpdate: (index: number, value: string) => void
  placeholder?: string
}
export default function ListItemInput(props: Props) {
  const {
    defaultValue,
    placeholder = '',
    index,
    handleDelete,
    handleUpdate,
  } = props

  const onSubmit = (value: string) => handleUpdate(index, value)
  const { register, isEmpty } = useField({
    onSubmit,
    defaultValue,
    onBlur: () => isEmpty && handleDelete(index), // delete empty items
  })

  return (
    <OutlinedInput
      placeholder={placeholder}
      autoComplete="off"
      inputProps={{
        'aria-label': 'edit',
        ...register(),
      }}
      endAdornment={
        <>
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={() => handleDelete(index)}
            ariaLabel="delete item"
          >
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}
