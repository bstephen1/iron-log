import AccessTimeIcon from '@mui/icons-material/AccessTime'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
} from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import SelectFieldAutosave from 'components/form-fields/SelectFieldAutosave'
import {
  ArrayMatchType,
  ArrayMatchTypeDescription,
} from 'models/query-filters/MongoQuery'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import { useState } from 'react'
import TooltipIconButton from '../../TooltipIconButton'
import SetTypeSelect from '../records/SetTypeSelect'
import useCurrentRecord from '../records/useCurrentRecord'

interface Props {
  filter: RecordQuery
  updateFilter: (changes: Partial<RecordQuery>) => void
}
export default function HistoryFilterHeaderButton({
  filter,
  updateFilter,
}: Props) {
  const [open, setOpen] = useState(false)
  const [shouldSync, setShouldSync] = useState(true)
  const { record } = useCurrentRecord()

  const onSyncChange = (checked: boolean) => {
    setShouldSync(checked)

    // reset filter to record's current values
    if (checked) {
      updateFilter({
        ...record.setType,
        modifier: record.activeModifiers,
        modifierMatchType: ArrayMatchType.Equivalent,
      })
    }
  }

  const handleFilterChange = (changes: Partial<RecordQuery>) => {
    setShouldSync(false)
    updateFilter(changes)
  }

  return (
    <>
      <TooltipIconButton title="History Filter" onClick={() => setOpen(true)}>
        <AccessTimeIcon />
      </TooltipIconButton>
      <Dialog
        open={open}
        fullWidth
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle>History Filter</DialogTitle>
        <DialogContent>
          <Stack spacing={3} pb={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={shouldSync}
                  onChange={(_, checked) => onSyncChange(checked)}
                />
              }
              label="Sync with current record"
            />
            <ComboBoxField
              label="Modifiers"
              emptyPlaceholder="No filter"
              options={record.exercise?.modifiers}
              initialValue={filter?.modifier || []}
              variant="standard"
              handleSubmit={(modifier) => handleFilterChange({ modifier })}
              helperText=""
            />
            <SelectFieldAutosave
              fullWidth
              label="Modifier Match Type"
              options={Object.values(ArrayMatchType)}
              handleSubmit={(modifierMatchType) =>
                handleFilterChange({ modifierMatchType })
              }
              initialValue={
                filter.modifierMatchType ?? ArrayMatchType.Equivalent
              }
              variant="standard"
              helperText={ArrayMatchTypeDescription[
                filter.modifierMatchType ?? 'none'
              ].replaceAll('values', 'modifiers')}
            />
            <SetTypeSelect emptyOption="no filter" />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
