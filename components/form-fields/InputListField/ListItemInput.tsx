import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import { useRef } from 'react'
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

  const inputRef = useRef<HTMLInputElement>()
  // todo: circular refernce with isEmpty
  const onBlur = () => isEmpty && handleDelete(index)
  const onSubmit = (value: string) => handleUpdate(index, value)
  const { control, isEmpty } = useField({
    onSubmit,
    initialValue: defaultValue,
    onBlur,
  })

  return (
    <OutlinedInput
      {...control()}
      placeholder={placeholder}
      autoComplete="off"
      onKeyDown={(e) => e.code === 'Enter' && inputRef.current?.blur()}
      inputRef={inputRef}
      inputProps={{
        'aria-label': 'edit',
      }}
      endAdornment={
        <>
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={() => handleDelete(index)}
            ariaLabel="delete item"
          >
            {/* todo: should this be a different icon so clear button => clear, not delete? */}
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}
