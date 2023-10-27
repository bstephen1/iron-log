import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import NotesList from 'components/form-fields/NotesList'
import Note from 'models/Note'
import { useState } from 'react'
import RecordHeaderButton from '../RecordHeaderButton'
import useCurrentRecord from '../useCurrentRecord'

const title = 'Exercise Notes'

export interface Props {
  handleSubmit: (notes: Note[]) => void
}
/** Show notes from the record's selected exercise.
 *  If no exercise is selected, the button will be disabled.
 */
export default function ExerciseNotesButton({ handleSubmit }: Props) {
  const { exercise } = useCurrentRecord()
  const [open, setOpen] = useState(false)
  const notes = exercise?.notes ?? []
  const modifiers = exercise?.modifiers ?? []

  return (
    <>
      <RecordHeaderButton
        title={title}
        onClick={() => setOpen(true)}
        disabled={!exercise}
      >
        <Badge badgeContent={notes.length} color="primary">
          <FitnessCenterIcon />
        </Badge>
      </RecordHeaderButton>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <NotesList
            {...{
              options: modifiers,
              handleSubmit,
              notes,
              multiple: true,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
