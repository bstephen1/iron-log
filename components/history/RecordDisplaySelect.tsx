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
import type { PartialUpdate } from '../../lib/util'
import { ORDERED_DISPLAY_FIELDS } from '../../models/DisplayFields'
import type RecordDisplay from './RecordDisplay'
import {
  type RecordDisplayOperator,
  recordDisplayOperators,
} from './RecordDisplay'

const fieldOptions = ORDERED_DISPLAY_FIELDS.filter(
  (field) => !field.enabled?.unilateral && !field.enabled?.splitWeight
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
  const { operator, field } = recordDisplay
  const [open, setOpen] = useState(false)
  const menuValue = `${operator} ${field}`

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
        <FormControl>
          <FormLabel id={`record-display-operator-radio-label`}>
            Operator
          </FormLabel>
          <RadioGroup
            aria-labelledby={`record-display-operator-radio-label`}
            name={`record-display-operator-radio`}
            value={operator}
            onChange={(_, newOperator) => {
              updateRecordDisplay({
                operator: newOperator as RecordDisplayOperator,
              })
            }}
          >
            {recordDisplayOperators.map((graphOperators) => (
              <FormControlLabel
                key={graphOperators}
                value={graphOperators}
                control={<Radio />}
                label={graphOperators}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id={`record-display-field-radio-label`}>Field</FormLabel>
          <RadioGroup
            aria-labelledby={`record-display-field-radio-label`}
            name={`record-display-field-radio`}
            value={field}
            onChange={(_, newField) => {
              updateRecordDisplay({
                field: newField as typeof field,
              })
            }}
          >
            {fieldOptions.map(({ name }) => (
              <FormControlLabel
                key={name}
                value={name}
                control={<Radio />}
                label={name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Stack>
    </TextField>
  )
}
