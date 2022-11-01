import {
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  OutlinedInput,
} from '@mui/material'
import { useForm } from 'react-hook-form'

interface Props {
  onClose?: any
  open: boolean
  name: string
  label?: string
  valu?: any
  onSubmit?: any
}
// A standard form with a submit button to use as an alternative to an autosaving field
export default function EditFieldDialog(props: Props) {
  const {
    onClose,
    onSubmit,
    open,
    name,
    label = capitalize(name),
    value = '',
    ...InputProps
  } = props

  const handleClose = () => {
    onClose()
  }

  const handleListItemClick = (value: string) => {
    onClose()
  }

  const { register } = useForm()

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Edit {label}</DialogTitle>
      <DialogContent>
        <OutlinedInput
          autoComplete="off"
          {...InputProps}
          autoFocus
          inputProps={{ ...register(`${name}`) }}
        />
      </DialogContent>
      <DialogActions>
        <Button>Reset</Button>
        <Button variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  )
}
