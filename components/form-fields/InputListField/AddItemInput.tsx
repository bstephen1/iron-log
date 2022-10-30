import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import useField from '../useField'
import AdornmentButton from './AdornmentButton'

interface Props {
  placeholder?: string
  handleAdd: (s: any) => void
}
// This Input is a temporary value that we don't want to include in the list until/unless it is submitted.
export default function AddItemInput({ placeholder, handleAdd }: Props) {
  const onSubmit = (value: string) => {
    handleAdd(value)
    reset()
  }
  const { register, isEmpty, reset, submit } = useField({
    onSubmit,
    onChange: () => {},
    onBlur: () => {},
  })

  // todo: submit on Enter
  return (
    <OutlinedInput
      placeholder={placeholder}
      inputProps={{ ...register() }}
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
            handleClick={() => reset()}
            ariaLabel="clear input"
          >
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}
