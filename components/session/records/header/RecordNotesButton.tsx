import NotesIcon from '@mui/icons-material/Notes'
import Badge from '@mui/material/Badge'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import { upsertSessionLog } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import {
  useReplaceMutation,
  useSessionLog,
} from '../../../../lib/frontend/restService'
import type { PartialUpdate } from '../../../../lib/types'
import type { Note } from '../../../../models/Note'
import type { Record } from '../../../../models/Record'
import type { Set } from '../../../../models/Set'
import NotesList from '../../../form-fields/NotesList'
import TooltipIconButton from '../../../TooltipIconButton'

const title = 'Record notes'

interface Props {
  notes?: Note[]
  sides?: Set['side'][]
  /** considered readOnly if not provided */
  mutateRecordFields?: PartialUpdate<Record>
  /** Date of the record. Needed to retrieve session notes */
  date: string
}
export default memo(function RecordNotesButton({
  notes = [],
  sides = [],
  mutateRecordFields,
  date,
}: Props) {
  const readOnly = !mutateRecordFields
  const { data: sessionLog } = useSessionLog(date)
  const [open, setOpen] = useState(false)
  const replaceSessionLogMutate = useReplaceMutation({
    queryKey: [QUERY_KEYS.sessionLogs, date],
    replaceFn: upsertSessionLog,
  })

  const combinedNotes = [...(sessionLog?.notes ?? []), ...notes]
  const options = ['Session', 'Record']
  const initialTags = ['Record']

  // There's nothing actually defining tags for sets other than right here.
  // Since a user can arbitrarily set L/R/Both, behavior here can get pretty wonky.
  // The behavior we're assuming is that there are L and R sets which increment independently,
  // and a "both" set will increment both L and R. This lets the user set it up as
  // 1L, 1R, 2L, 2R or
  // 1L, 2L, 1R, 2R
  // It can get weird if you purposefully try to enter weird combinations though.
  let l = 1,
    r = 1
  for (const side of sides) {
    let setNumber = ''
    if (side === 'L') {
      setNumber = `${l} (L)`
      l++
    } else if (side === 'R') {
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

    const sessionNotes = []
    const recordNotes = []
    for (const note of notes) {
      // for record notes, each note should only have a single tag
      if (note.tags.includes('Session')) {
        sessionNotes.push(note)
      } else {
        recordNotes.push(note)
      }
    }

    if (recordNotes.length) {
      mutateRecordFields({ notes: recordNotes })
    }
    if (sessionNotes.length) {
      replaceSessionLogMutate({ ...sessionLog, notes: sessionNotes })
    }
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
}, isEqual)
