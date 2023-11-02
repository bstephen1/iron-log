import NotesIcon from '@mui/icons-material/Notes'
import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import NotesList from 'components/form-fields/NotesList'
import useCurrentSessionLog from 'components/session/useCurrentSessionLog'
import { updateSessionLog } from 'lib/frontend/restService'
import { UpdateFields } from 'lib/util'
import Note from 'models/Note'
import Record from 'models/Record'
import { Set } from 'models/Set'
import { memo, useState } from 'react'
import TooltipIconButton from '../../../TooltipIconButton'

const title = 'Record Notes'

interface Props {
  notes: Note[]
  sets: Set[]
  /** considered readOnly if not provided */
  mutateRecordFields?: UpdateFields<Record>
}
export default memo(function RecordNotesButton({
  notes = [],
  // sets we really just need the sides
  sets = [],
  mutateRecordFields,
}: Props) {
  const readOnly = !mutateRecordFields
  const { sessionLog, mutate: mutateSession } = useCurrentSessionLog()
  const [open, setOpen] = useState(false)

  const combinedNotes = [...(sessionLog?.notes ?? []), ...notes]
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
    if (!sessionLog || readOnly) return

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

    mutateRecordFields({ notes: recordNotes })
    const newSessionLog = { ...sessionLog, notes: sessionNotes }
    mutateSession(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })
  }

  return (
    <>
      <TooltipIconButton title={title} onClick={() => setOpen(true)}>
        <Badge badgeContent={combinedNotes.length} color="primary">
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
              notes: combinedNotes,
              initialTags,
              readOnly,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
})
