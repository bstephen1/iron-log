import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import { useRef } from 'react'
import TransitionIconButton from '../../TransitionIconButton'
import useField from '../useField'

interface Props {
  initialValue: string
  index: number
  handleDelete: (index: number) => void
  handleUpdate: (index: number, value: string) => void
  placeholder?: string
}
export default function ListItemInput(props: Props) {
  const {
    initialValue,
    placeholder = '',
    index,
    handleDelete,
    handleUpdate,
  } = props

  const inputRef = useRef<HTMLInputElement>()
  const handleSubmit = (value: string) => handleUpdate(index, value)
  const { control, isEmpty } = useField({
    handleSubmit,
    initialValue,
  })

  return (
    <OutlinedInput
      {...control()}
      onBlur={() => isEmpty && handleDelete(index)}
      placeholder={placeholder}
      autoComplete="off"
      onKeyDown={(e) => e.code === 'Enter' && inputRef.current?.blur()}
      inputRef={inputRef}
      inputProps={{
        'aria-label': 'edit',
      }}
      endAdornment={
        <>
          <TransitionIconButton
            isVisible={!isEmpty}
            onClick={() => handleDelete(index)}
            aria-label="delete item"
          >
            {/* todo: should this be a different icon so clear button => clear, not delete? */}
            {/* NotInterestedIcon ? */}
            <ClearIcon />
          </TransitionIconButton>
        </>
      }
    />
  )
}
