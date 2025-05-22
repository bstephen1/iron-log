import DeleteIcon from '@mui/icons-material/Delete'
import Button, { type ButtonProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { useState } from 'react'

interface Props {
  /** Type of record being deleted. Appears in the dialog title */
  type: string
  /** name of the item being deleted */
  name: string
  handleDelete: () => void
  buttonProps?: ButtonProps
}
export default function DeleteButton({
  type,
  name,
  handleDelete,
  buttonProps,
}: Props) {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button
        color="error"
        onClick={() => setOpen(true)}
        startIcon={<DeleteIcon />}
        {...buttonProps}
      >
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete {type}?</DialogTitle>
        <DialogContent>
          <b>{name}</b> will be permanently deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
