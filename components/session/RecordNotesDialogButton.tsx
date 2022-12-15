import { Notes } from '@mui/icons-material'
import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ComponentProps, ReactElement, useState } from 'react'
import Note from '../../models/Note'
import NotesList from '../form-fields/NotesList'
import RecordHeaderButton from './RecordHeaderButton'

export interface Props
  extends Partial<ComponentProps<typeof RecordHeaderButton>> {
  notes: Note[]
  setsAmount?: number
  options?: string[]
  Icon?: ReactElement
  initialTags?: string[]
  handleSubmit: (notes: Note[]) => void
  multiple?: boolean
  tooltipTitle?: string
}
// the defaults set up notes for a RecordCard, but the component is extensible to allow customization for other note sources
export default function RecordNotesDialogButton({
  notes,
  setsAmount = 0,
  options = [],
  Icon = <Notes />,
  initialTags = [],
  handleSubmit,
  multiple,
  tooltipTitle = 'Record Notes',
  ...recordHeaderButtonProps
}: Props) {
  const [open, setOpen] = useState(false)

  // todo: probably store these in a new db collection
  if (!options.length) {
    // Session tagged notes should propagate to all records in the session? Would need an id for notes
    options = ['Session', 'Record']
    initialTags = ['Record']

    // the rare full for loop
    for (let i = 1; i <= setsAmount; i++) {
      options.push(`Set ${i}`)
    }
  }

  return (
    <>
      <RecordHeaderButton
        title={tooltipTitle}
        onClick={() => setOpen(true)}
        {...recordHeaderButtonProps}
      >
        <Badge badgeContent={notes.length} color="primary">
          {Icon}
        </Badge>
      </RecordHeaderButton>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          <NotesList
            {...{ options, handleSubmit, notes, initialTags, multiple }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
