import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { capitalize, type PartialUpdate } from '../../lib/util'
import { ORDERED_DISPLAY_FIELDS } from '../../models/DisplayFields'
import type RecordDisplay from './RecordDisplay'
import { recordDisplayGroupings, recordDisplayOperators } from './RecordDisplay'

const fieldOptions = ORDERED_DISPLAY_FIELDS.map(({ name }) => name).filter(
  (name): name is RecordDisplay['field'] =>
    !['side', 'plateWeight', 'totalWeight'].includes(name)
)

type Props = {
  updateRecordDisplay: PartialUpdate<RecordDisplay>
  recordDisplay: RecordDisplay
} & Partial<TextFieldProps>

export default function RecordDisplaySelect({
  updateRecordDisplay,
  recordDisplay,
  ...textFieldProps
}: Props) {
  const { grouping, operator, field } = recordDisplay
  const [open, setOpen] = useState(false)
  const menuValue = `${grouping} ${operator} ${field}`

  const handleClose = () => setOpen(false)

  return (
    <TextField
      select
      fullWidth
      label="Record display"
      value={menuValue}
      {...textFieldProps}
      slotProps={{
        ...textFieldProps.slotProps,
        select: {
          open,
          onOpen: () => setOpen(true),
          onClose: handleClose,
          displayEmpty: true,
          autoWidth: true,
          renderValue: () => <Typography>{menuValue}</Typography>,
          ...textFieldProps.slotProps?.select,
        },
        inputLabel: { shrink: true },
      }}
    >
      {/* allows menuValue to not be out of range */}
      <MenuItem value={menuValue} sx={{ display: 'none' }} />
      <Stack px={2} pt={1} direction="row" spacing={2}>
        <RenderOptions
          field="grouping"
          value={grouping}
          options={recordDisplayGroupings}
          updateRecordDisplay={updateRecordDisplay}
        />
        <RenderOptions
          field="operator"
          value={operator}
          options={recordDisplayOperators}
          updateRecordDisplay={updateRecordDisplay}
        />
        <RenderOptions
          field="field"
          value={field}
          options={fieldOptions}
          updateRecordDisplay={updateRecordDisplay}
        />
      </Stack>
    </TextField>
  )
}

interface RenderOptionsProps<T extends keyof RecordDisplay> {
  field: T
  value: RecordDisplay[T]
  options: readonly RecordDisplay[T][]
  updateRecordDisplay: Props['updateRecordDisplay']
}
const RenderOptions = <T extends keyof RecordDisplay>({
  field,
  value,
  options,
  updateRecordDisplay,
}: RenderOptionsProps<T>) => (
  <FormControl>
    <FormLabel id={`record-display-${field}-radio-label`}>
      {capitalize(field)}
    </FormLabel>
    <RadioGroup
      aria-labelledby={`record-display-${field}-radio-label`}
      name={`record-display-${field}-radio`}
      value={value}
      onChange={(_, newField) => {
        updateRecordDisplay({
          [field]: newField as typeof field,
        })
      }}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option}
          value={option}
          control={<Radio />}
          label={option}
        />
      ))}
    </RadioGroup>
  </FormControl>
)
