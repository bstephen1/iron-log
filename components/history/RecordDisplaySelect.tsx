import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { UpdateState } from '../../lib/util'
import { ORDERED_DISPLAY_FIELDS } from '../../models/DisplayFields'
import RecordDisplay, {
  RecordDisplayOperator,
  recordDisplayOperators,
} from './RecordDisplay'

const fieldOptions = ORDERED_DISPLAY_FIELDS.filter(
  (field) => !field.enabled?.unilateral && !field.enabled?.splitWeight
)

type Props = {
  updateRecordDisplay: UpdateState<RecordDisplay>
  recordDisplay: RecordDisplay
} & Partial<TextFieldProps>

export default function RecordDisplaySelect({
  updateRecordDisplay,
  SelectProps,
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
      InputLabelProps={{ shrink: true }}
      SelectProps={{
        open,
        onOpen: () => setOpen(true),
        onClose: handleClose,
        displayEmpty: true,
        autoWidth: true,
        renderValue: () => <Typography>{menuValue}</Typography>,
        // Fix standard background, preventing gray shadow. See SelectFieldAutosave.
        variant: 'outlined',
        ...SelectProps,
      }}
      {...textFieldProps}
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
