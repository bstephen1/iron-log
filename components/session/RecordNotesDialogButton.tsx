import { Notes } from '@mui/icons-material'
import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ComponentProps, useState } from 'react'
import Note from '../../models/Note'
import NotesList from '../form-fields/NotesList'
import RecordHeaderButton from './RecordHeaderButton'

export interface Props
  extends Partial<ComponentProps<typeof RecordHeaderButton>> {
  notes: Note[]
  setsAmount: number
  handleSubmit: (notes: Note[]) => void
}
export default function RecordNotesDialogButton({
  notes,
  setsAmount,
  handleSubmit,
  ...recordHeaderButtonProps
}: Props) {
  const [open, setOpen] = useState(false)

  // thinking only allow a single tag, and default to "Record" (no null tag)
  // also, Session tagged notes should propagate to all records in the session
  const options = ['Session', 'Record']

  // the rare full for loop
  for (let i = 1; i <= setsAmount; i++) {
    options.push(`Set ${i}`)
  }

  return (
    <>
      <RecordHeaderButton
        title="Record Notes"
        onClick={() => setOpen(true)}
        {...recordHeaderButtonProps}
      >
        <Badge badgeContent={notes.length} color="primary">
          <Notes />
        </Badge>
      </RecordHeaderButton>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          <NotesList {...{ options, handleSubmit, notes }} />
        </DialogContent>
      </Dialog>
    </>
  )
}
