import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'lib/frontend/constants'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import Record from 'models/Record'
import { Set } from 'models/Set'
import { useEffect, useState } from 'react'
import RecordHeaderButton from '../records/RecordHeaderButton'

const allSameReps = (sets: Set[]) => {
  let reps = sets[0].reps
  for (const set of sets) {
    reps = set.reps === reps ? reps : 0
    if (!reps) return undefined
  }
  return reps
}

interface Props {
  record: Record
  filter?: RecordQuery
  /** must be memoized with useCallback, or use setState directly */
  handleFilterChange: (changes: Partial<RecordQuery>) => void
}
export default function HistoryFilterHeaderButton({
  record,
  filter,
  handleFilterChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const repsDisabled =
    filter?.modifier?.includes('amrap') || filter?.modifier?.includes('myo')

  // Update filter when record changes. In practice this will only update when activeModifiers or sets are changed.
  useEffect(() => {
    // todo: can't filter on no modifiers. Api gets "modifier=&" which is just dropped.
    // todo: amrap/myo should be special default modifiers rather than hardcoding here
    const reps = repsDisabled ? undefined : allSameReps(record.sets)

    handleFilterChange({
      reps,
      modifier: record.activeModifiers,
      // don't want to include the actual record in its own history
      end: dayjs(record.date).add(-1, 'day').format(DATE_FORMAT),
      exercise: record.exercise?.name,
      limit: 10,
    })
  }, [
    handleFilterChange,
    record.activeModifiers,
    record.date,
    record.exercise?.name,
    record.sets,
    repsDisabled,
  ])

  return (
    <>
      <RecordHeaderButton title="History Filter" onClick={() => setOpen(true)}>
        <AccessTimeIcon />
      </RecordHeaderButton>
      <Dialog
        open={open}
        fullWidth
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle>History Filters</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <ComboBoxField
              label="Modifiers"
              emptyPlaceholder="No filter"
              options={record.exercise?.modifiers}
              initialValue={filter?.modifier || []}
              variant="standard"
              handleSubmit={(modifier) => handleFilterChange({ modifier })}
            />
            {/* todo: make a range slider? Would also have to update backend to support range queries */}
            <NumericFieldAutosave
              label="Reps"
              placeholder="No filter"
              initialValue={filter?.reps}
              handleSubmit={(reps) => handleFilterChange({ reps })}
              variant="standard"
              disabled={repsDisabled}
              InputLabelProps={{ shrink: true }}
              helperText={
                repsDisabled
                  ? "Can't filter reps with myo or amrap modifiers enabled"
                  : ' '
              }
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
