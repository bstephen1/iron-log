import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import { useController, useFormContext } from 'react-hook-form'
import AdornmentButton from './AdornmentButton'

interface Props {
  name: string
  index: number
  handleDelete: (index: number) => void
  placeholder?: string
}
export default function ListItemInput(props: Props) {
  const { placeholder = '', index, name, handleDelete } = props
  const { register } = useFormContext()
  const {
    field: { value },
    fieldState: { isDirty },
  } = useController({ name: `${name}.${index}` })

  return (
    <OutlinedInput
      placeholder={placeholder}
      autoComplete="off"
      onBlur={() => !value && handleDelete(index)} // delete empty items
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
