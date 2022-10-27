import ClearIcon from '@mui/icons-material/Clear'
import { Grow, IconButton, InputBase, Paper } from '@mui/material'
import { useController, useFormContext } from 'react-hook-form'

interface BaseProps {
  name: string
  index: number
  handleDelete: Function
  placeholder?: string
}
export default function InputListItem(props: BaseProps) {
  const { placeholder, index, name, handleDelete } = props
  const { register } = useFormContext()
  const {
    field,
    fieldState: { isDirty },
  } = useController({ name: `${name}.${index}` }) // todo: props the name
  let { value, onBlur } = field

  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        // {...field}
        // value={value}
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
        inputProps={{
          'aria-label': 'edit',
          ...register(`cues.${index}`),
        }}
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
