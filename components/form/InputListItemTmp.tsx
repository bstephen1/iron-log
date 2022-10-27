import CheckIcon from '@mui/icons-material/Check'

import ClearIcon from '@mui/icons-material/Clear'
import { Grow, IconButton, InputBase, Paper } from '@mui/material'
import { useContext } from 'react'
import {
  useController,
  useFieldArray,
  UseFormRegisterReturn,
} from 'react-hook-form'
import { InputListFieldContext } from './InputListField'

interface ListItemProps {
  index: number
}

// todo: after cleanup it seems the intermediary components are superfluous
// the only potential snag is what to do about the hooks...
export default function InputListItem(props: ListItemProps) {
  const { index } = props

  return (
    <InputBaseStyle
      index={index}
      // register={register(`${name}.${index}.value`)}
    />
  )
}

interface BaseProps {
  index: number
  placeholder?: string
  register?: UseFormRegisterReturn<any>
}
function InputBaseStyle(props: BaseProps) {
  const { handleDelete } = useContext(InputListFieldContext)
  const { placeholder, index } = props
  const {
    field,
    fieldState: { isDirty },
  } = useController({ name: `${name}.${index}` })
  let { value, onBlur } = field

  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        {...field}
        value={value}
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        // autoFocus={!value}
        // disabled={!cleanExercise}
        multiline // allow it to be multiline if it gets that long, but don't allow manual newlines
        // onBlur={() => handleConfirm(value)}
        // onKeyDown={(e) =>
        //   e.key === 'Enter' && (document.activeElement as HTMLElement).blur()
        // }
        // onChange={(e) => setValue(e.target.value)}
        // inputProps={{ 'aria-label': 'edit cue', ...register }}
        endAdornment={
          <>
            <Grow in={!!value}>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="clear input"
                onClick={() => {
                  handleDelete(index)
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
