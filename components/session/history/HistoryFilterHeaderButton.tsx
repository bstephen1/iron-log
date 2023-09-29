import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import Record from 'models/Record'
import { useState } from 'react'
import RecordHeaderButton from '../records/RecordHeaderButton'

interface Props {
  record: Record
  filter?: RecordQuery
  updateFilter: (changes: Partial<RecordQuery>) => void
}
export default function HistoryFilterHeaderButton({
  record,
  filter,
  updateFilter,
}: Props) {
  const [open, setOpen] = useState(false)

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
              handleSubmit={(modifier) => updateFilter({ modifier })}
            />
            {/* todo: make a range slider? Would also have to update backend to support range queries */}
            <NumericFieldAutosave
              label="Reps"
              placeholder="No filter"
              initialValue={filter?.reps}
              handleSubmit={(reps) => updateFilter({ reps })}
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
