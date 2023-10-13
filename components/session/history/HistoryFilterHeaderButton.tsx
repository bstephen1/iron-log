import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import Record, { SetType } from 'models/Record'
import { Units } from 'models/Set'
import { useState } from 'react'
import RecordHeaderButton from '../records/RecordHeaderButton'
import SetTypeSelect from '../records/SetTypeSelect'

interface Props {
  record: Record
  filter?: RecordQuery
  updateFilter: (changes: Partial<RecordQuery>) => void
  units: Units
  setType: SetType
}
export default function HistoryFilterHeaderButton({
  record,
  filter,
  updateFilter,
  units,
  setType,
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
          <Stack spacing={3} pb={3}>
            <ComboBoxField
              label="Modifiers"
              emptyPlaceholder="No filter"
              options={record.exercise?.modifiers}
              initialValue={filter?.modifier || []}
              variant="standard"
              handleSubmit={(modifier) => updateFilter({ modifier })}
              helperText=""
            />
            <SetTypeSelect
              units={units}
              setType={setType}
              handleSubmit={updateFilter}
              sets={[]}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
