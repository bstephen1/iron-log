import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import { useRef } from 'react'
import useField from '../useField'
import AdornmentButton from './AdornmentButton'

interface Props {
  placeholder?: string
  handleAdd: (s: any) => void
  disabled: boolean
}
// This Input is a temporary value that isn't include in the list until/unless it is submitted.
export default function AddItemInput({
  placeholder,
  handleAdd,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>()
  const onSubmit = (value: string) => {
    handleAdd(value)
    onReset()
  }
  const onReset = () => {
    reset('')
    inputRef.current?.focus()
  }

  const { control, isEmpty, reset, submit } = useField({
    onSubmit,
    initialValue: '',
    useDebounce: false,
    onBlur: () => {},
  })

  return (
    <OutlinedInput
      {...control()}
      placeholder={placeholder}
      disabled={disabled}
      onKeyDown={(e) => e.code === 'Enter' && submit()}
      inputRef={inputRef}
      endAdornment={
        <>
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={submit}
            ariaLabel="add cue"
          >
            <CheckIcon />
          </AdornmentButton>
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={onReset}
            ariaLabel="clear input"
          >
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}
