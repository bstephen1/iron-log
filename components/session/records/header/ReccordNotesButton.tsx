import NotesIcon from '@mui/icons-material/Notes'
import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import NotesList from 'components/form-fields/NotesList'
import { updateSessionLog, useSessionLog } from 'lib/frontend/restService'
import Note from 'models/Note'
import { useState } from 'react'
import TooltipIconButton from '../../../TooltipIconButton'
import useCurrentRecord from '../useCurrentRecord'

const title = 'Record Notes'

interface Props {
  readOnly?: boolean
}
export default function RecordNotesButton({ readOnly }: Props) {
  const { updateFields, record, sets, date } = useCurrentRecord()
  const { sessionLog, mutate: mutateSession } = useSessionLog(date)
  const [open, setOpen] = useState(false)

  const notes = [...(sessionLog?.notes ?? []), ...record.notes]
  let options = ['Session', 'Record']
  let initialTags = ['Record']

  // There's nothing actually defining tags for sets other than right here.
  // Since a user can arbitrarily set L/R/Both, behavior here can get pretty wonky.
  // The behavior we're assuming is that there are L and R sets which increment independently,
  // and a "both" set will increment both L and R. This lets the user set it up as
  // 1L, 1R, 2L, 2R or
  // 1L, 2L, 1R, 2R
  // It can get weird if you purposefully try to enter weird combinations though.
  let l = 1,
    r = 1
  for (const set of sets) {
    let setNumber = ''
    if (set.side === 'L') {
      setNumber = `${l} (L)`
      l++
    } else if (set.side === 'R') {
      setNumber = `${r} (R)`
      r++
    } else {
      setNumber = `${Math.max(l, r)}`
      l++
      r++
    }

    options.push(`Set ${setNumber}`)
  }

  const handleSubmit = async (notes: Note[]) => {
    if (!sessionLog) return

    let sessionNotes = []
    let recordNotes = []
    for (const note of notes) {
      // for record notes, each note should only have a single tag
      if (note.tags.includes('Session')) {
        sessionNotes.push(note)
      } else {
        recordNotes.push(note)
      }
    }

    updateFields({ notes: recordNotes })
    const newSessionLog = { ...sessionLog, notes: sessionNotes }
    mutateSession(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })
  }

  return (
    <>
      <TooltipIconButton title={title} onClick={() => setOpen(true)}>
        <Badge badgeContent={notes.length} color="primary">
          <NotesIcon />
        </Badge>
      </TooltipIconButton>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <NotesList
            {...{
              options,
              handleSubmit,
              notes,
              initialTags,
              readOnly,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
