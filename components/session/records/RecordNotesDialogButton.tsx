import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { ComponentProps, ReactElement, useState } from 'react'
import { doNothing } from '../../../lib/util'
import Note from '../../../models/Note'
import { Set } from '../../../models/Set'
import NotesList from '../../form-fields/NotesList'
import RecordHeaderButton from './RecordHeaderButton'

export interface Props
  extends Partial<ComponentProps<typeof RecordHeaderButton>> {
  notes: Note[]
  sets?: Set[]
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
  sets = [],
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

    // There's nothing actually defining which set is
    // which other than right here. Since a user can arbitrarily set L/R/Both,
    // behavior here can get pretty wonky. The behavior we're assuming is that
    // there are L and R sets which increment independently, and a "both" set
    // will increment both L and R. This lets the user set it up as
    // 1L, 1R, 2L, 2R or
    // 1L, 2L, 1R, 2R
    // It can get weird if you purposefully try to enter weird combinations though.
    let l = 1,
      r = 1
    for (const set of sets) {
      let text = ''
      if (set.side === 'L') {
        text = `${l} (L)`
        l++
      } else if (set.side === 'R') {
        text = `${r} (R)`
        r++
      } else {
        text = `${Math.max(l, r)}`
        l++
        r++
      }

      options.push(`Set ${text}`)
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
