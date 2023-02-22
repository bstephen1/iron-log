import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ComponentProps, ReactElement, useState } from 'react'
import { doNothing } from '../../../lib/util'
import Note from '../../../models/Note'
import NotesList from '../../form-fields/NotesList'
import RecordHeaderButton from './RecordHeaderButton'

export interface Props
  extends Partial<ComponentProps<typeof RecordHeaderButton>> {
  notes: Note[]
  setsAmount?: number
  options?: string[]
  Icon: ReactElement
  initialTags?: string[]
  handleSubmit?: (notes: Note[]) => void
  multiple?: boolean
  tooltipTitle?: string
  readOnly?: boolean
}
export default function RecordNotesDialogButton({
  notes,
  setsAmount = 0,
  options,
  Icon,
  initialTags = [],
  handleSubmit = doNothing,
  multiple,
  tooltipTitle = '',
  readOnly = false,
  ...recordHeaderButtonProps
}: Props) {
  const [open, setOpen] = useState(false)

  // setup tags for record notes
  // todo: setup a type or something for RecordNoteTags?
  if (!options) {
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
            {...{
              options,
              handleSubmit,
              notes,
              initialTags,
              multiple,
              readOnly,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
