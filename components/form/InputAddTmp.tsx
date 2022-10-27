import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { Grow, IconButton, InputBase, Paper } from '@mui/material'
import { useContext } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { InputListFieldContext } from './InputListField'

interface BasePropsTmp {
  handleConfirm: any
  placeholder?: string
}
export default function InputAdd(props: BasePropsTmp) {
  const { placeholder } = props
  const { handleAdd } = useContext(InputListFieldContext)
  const { register, handleSubmit, watch, reset } = useForm()

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
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        // value={value}
        // onBlur={handleSubmit}
        // onChange={(e) => setValue(e.target.value)}
        multiline
        defaultValue=""
        inputProps={{ ...register('add') }}
        endAdornment={
          <>
            <Grow in={!!watch('add')}>
              <IconButton
                type="button" // todo: submit? make paper form?
                sx={{ p: '10px' }}
                aria-label="add cue"
                onClick={handleSubmit(onSubmit)}
              >
                <CheckIcon />
              </IconButton>
            </Grow>
            {/* todo: this actually adds to list, bc onBlur */}
            <Grow in={!!watch('add')}>
              <IconButton
                type="button" // todo: reset just the nested form.... need another FORM
                sx={{ p: '10px' }}
                aria-label="reset input"
                onClick={resetAdd}
              >
                <ClearIcon />
              </IconButton>
            </Grow>
          </>
        }
      />
    </Paper>
  )
}
