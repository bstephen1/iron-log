import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import useField from '../useField'
import AdornmentButton from './AdornmentButton'

interface Props {
  placeholder?: string
  handleAdd: (s: any) => void
  disabled: boolean
}
// This Input is a temporary value that we don't want to include in the list until/unless it is submitted.
export default function AddItemInput({
  placeholder,
  handleAdd,
  disabled,
}: Props) {
  const onSubmit = (value: string) => {
    handleAdd(value)
    reset('')
  }
  const { control, isEmpty, reset, submit } = useField({
    onSubmit,
    initialValue: '',
    useDebounce: false,
  })

  // todo: submit on Enter
  // todo: keep focus on input on clear (and submit?)
  return (
    <OutlinedInput
      {...control()}
      placeholder={placeholder}
      disabled={disabled}
      endAdornment={
        <>
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={submit}
            ariaLabel="add cue"
          >
            <CheckIcon />
          </AdornmentButton>
          {/* todo: this actually adds to list, bc onBlur submits. Should it? Or just clicking check mark? */}
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={() => reset('')}
            ariaLabel="clear input"
          >
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}
