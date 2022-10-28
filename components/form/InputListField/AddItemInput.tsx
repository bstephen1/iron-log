import { OutlinedInput } from '@mui/material'
import { useForm, FieldValues } from 'react-hook-form'
import AdornmentButton from './AdornmentButton'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import * as Yup from 'Yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface Props {
  placeholder?: string
  handleAdd: (s: any) => void
}
export default function AddItemInput({ placeholder, handleAdd }: Props) {
  const schema = Yup.object({
    add: Yup.string(),
  })

  // Use a new useForm to separate this from the main form.
  // This Input is a temporary value that we don't want to include in the list
  // until/unless it is submitted.
  const { register, handleSubmit, watch, reset } = useForm({
    resolver: yupResolver(schema),
  })
  const isEmpty = !watch('add')

  const resetValue = () => {
    reset((fields) => ({
      ...fields,
      add: '',
    }))
  }

  const onSubmit = (fields: FieldValues) => {
    handleAdd(fields.add)
    resetValue()
  }

  // todo: submit on Enter
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
          {/* todo: this actually adds to list, bc onBlur submits. Should it? Or just clicking check mark? */}
          <AdornmentButton
            isVisible={!isEmpty}
            handleClick={resetValue}
            ariaLabel="clear input"
          >
            <ClearIcon />
          </AdornmentButton>
        </>
      }
    />
  )
}
