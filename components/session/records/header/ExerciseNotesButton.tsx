import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import Badge from '@mui/material/Badge'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import NotesList from '../../../../components/form-fields/NotesList'
import { useExerciseModifiers } from '../../../../lib/frontend/data/useQuery'
import type { Note } from '../../../../models/Note'
import TooltipIconButton from '../../../TooltipIconButton'
import { useExerciseUpdate } from '../useRecordUpdate'

const title = 'Exercise notes'

interface Props {
  /** considered readOnly if not provided */
  _id?: string
  notes?: Note[]
  disabled?: boolean
}
/** Show notes from the record's selected exercise. */
export default memo(function ExerciseNotesButton({
  _id,
  notes = [],
  disabled,
}: Props) {
  const readOnly = !_id
  const [open, setOpen] = useState(false)
  const updateExercise = useExerciseUpdate(_id)
  const modifiers = useExerciseModifiers(_id)

  const handleSubmit = (notes: Note[]) => updateExercise({ notes })

  return (
    <>
      <TooltipIconButton
        title={title}
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <Badge badgeContent={notes.length} color="primary">
          <FitnessCenterIcon />
        </Badge>
      </TooltipIconButton>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <NotesList
            {...{
              options: modifiers,
              handleSubmit,
              notes,
              multiple: true,
              readOnly,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}, isEqual)
