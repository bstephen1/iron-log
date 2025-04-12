import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import { Badge, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import NotesList from '../../../../components/form-fields/NotesList'
import { UpdateFields } from '../../../../lib/util'
import { Exercise } from '../../../../models/AsyncSelectorOption/Exercise'
import { Note } from '../../../../models/Note'
import TooltipIconButton from '../../../TooltipIconButton'

const title = 'Exercise notes'

interface Props {
  /** considered readOnly if not provided */
  mutateExerciseFields?: UpdateFields<Exercise>
  notes?: Note[]
  /** used for note tags */
  modifiers?: string[]
  disabled?: boolean
}
/** Show notes from the record's selected exercise. */
export default memo(function ExerciseNotesButton({
  mutateExerciseFields,
  notes = [],
  modifiers = [],
  disabled,
}: Props) {
  const readOnly = !mutateExerciseFields
  const [open, setOpen] = useState(false)

  const handleSubmit = (notes: Note[]) => mutateExerciseFields?.({ notes })

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
