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
  name: string
  index: number
  placeholder?: string
  value: string
  handleDelete: (index: number) => void
  handleUpdate: (newCue: string, index: number) => void
}
export default function InputListItem(props: ListItemProps) {
  const { placeholder, index, name } = props
  const { fields, remove, update } = useFieldArray({ name })
  const controller = useController({ name: `${name}.${index}` })

  return (
    <InputBaseStyle
      controller={controller}
      index={index}
      placeholder="Edit Cue"
      // register={register(`${name}.${index}.value`)}
    />
  )
}

interface BaseProps {
  controller: any
  index: number
  placeholder?: string
  register?: UseFormRegisterReturn<any>
}
function InputBaseStyle(props: BaseProps) {
  const { handleDelete } = useContext(InputListFieldContext)
  const {
    placeholder,
    controller: {
      field,
      fieldState: { isDirty },
    },
    index,
  } = props
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
