import HistoryIcon from '@mui/icons-material/History'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import Record from 'models/Record'
import { useEffect, useState } from 'react'
import RecordHeaderButton from '../records/RecordHeaderButton'

interface Props {
  record: Record
  handleFilterChange: (changes: Partial<RecordQuery>) => void
}
export default function HistoryFilterHeaderButton({
  record,
  handleFilterChange,
}: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    console.log('calling uef')
    // todo: can't filter on no modifiers. Api gets "modifier=&" which is just dropped.
    // todo: amrap/myo should be special default modifiers rather than hardcoding here
    const reps =
      record.sets[0]?.reps &&
      !record.activeModifiers.includes('amrap') &&
      !record.activeModifiers.includes('myo')
        ? record.sets[0].reps
        : undefined

    handleFilterChange({
      reps,
      modifier: record.activeModifiers,
      end: record.date,
      limit: 5,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.activeModifiers, record.sets[0].reps])

  return (
    <>
      <RecordHeaderButton title="History Filter" onClick={() => setOpen(true)}>
        <HistoryIcon />
      </RecordHeaderButton>
      <Dialog
        open={open}
        fullWidth
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle>History Filter</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <ComboBoxField
              label="Modifiers"
              emptyPlaceholder="No filter"
              options={record.exercise?.modifiers}
              initialValue={record.activeModifiers}
              variant="standard"
              handleSubmit={(modifier) => handleFilterChange({ modifier })}
            />
            {/* todo: make a range slider? Would also have to update backend to support range queries */}
            <NumericFieldAutosave
              label="Reps"
              placeholder="No filter"
              initialValue={record.sets[0]?.reps}
              handleSubmit={(reps) => handleFilterChange({ reps })}
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
