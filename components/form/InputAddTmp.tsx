import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { Grow, IconButton, InputBase, Paper } from '@mui/material'
import { useContext, useState } from 'react'
import { InputListFieldContext } from './InputListField'

export default function InputAdd({ placeholder, handleConfirm }: any) {
  return (
    <InputBaseStyleTmp
      handleConfirm={handleConfirm}
      placeholder={placeholder}
    />
  )
}

interface BasePropsTmp {
  handleConfirm: any
  placeholder?: string
}
function InputBaseStyleTmp(props: BasePropsTmp) {
  const { placeholder } = props
  const { handleAdd } = useContext(InputListFieldContext)

  const [value, setValue] = useState('')
  const handleSubmit = () => {
    handleAdd(value)
    setValue('')
  }

  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onBlur={handleSubmit}
        onChange={(e) => setValue(e.target.value)}
        multiline
        endAdornment={
          <>
            <Grow in={!!value}>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="add cue"
                onClick={handleSubmit}
              >
                <CheckIcon />
              </IconButton>
            </Grow>
            {/* todo: this actually adds to list, bc onBlur */}
            <Grow in={!!value}>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="clear input"
                onClick={() => {
                  setValue('')
                }}
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
