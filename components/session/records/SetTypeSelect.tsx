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
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import useNoSwipingDesktop from 'lib/frontend/useNoSwipingSmScreen'
import { UpdateFields } from 'lib/util'
import {
  ORDERED_DISPLAY_FIELDS,
  printFieldWithUnits,
} from 'models/DisplayFields'
import Record, { SetType, setOperators } from 'models/Record'
import { Units } from 'models/Set'
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'

const normalFields = ORDERED_DISPLAY_FIELDS.filter(
  (field) => !field.enabled?.unilateral && !field.enabled?.splitWeight
)

const timeField = ORDERED_DISPLAY_FIELDS.filter(
  (field) => field.source === 'time'
)

const getUnit = (field: SetType['field'], units: Units) =>
  units[field as keyof Units] ?? field

type Props = {
  /** considered readOnly if not provided */
  handleChange?: UpdateFields<Record> | ((changes: Partial<Record>) => void)
  units: Units
  /** When nonzero, displays the given number as the total number of reps over all sets. */
  totalReps?: number
  setType: SetType
} & Partial<TextFieldProps>
export default memo(function SetTypeSelect({
  handleChange,
  totalReps = 0,
  units,
  setType,
  ...textFieldProps
}: Props) {
  const { field, value = 0, operator, min = 0, max = 0 } = setType
  const fieldOptions = operator === 'rest' ? timeField : normalFields
  const remaining = (value ?? 0) - totalReps
  const isOverTotal = remaining < 0
  const remainingText =
    operator === 'total'
      ? ` (${Math.abs(remaining)} ${isOverTotal ? 'over' : 'remaining'})`
      : ''
  const noSwipingDesktop = useNoSwipingDesktop()
  const readOnly = !handleChange
  const [open, setOpen] = useState(false)
  const updateSetType = (changes: Partial<SetType>) => {
    const newSetType = { ...setType, ...changes }

    handleChange?.({ setType: newSetType })
  }

  const menuValue = `${operator} ${
    operator === 'between' ? min + ' and ' + max : value
  } ${getUnit(field, units)}`

  const handleClose = () => setOpen(false)

  // todo: maybe store prev operator so when switching back from rest it changes back from "time" to whatever you had before
  return (
    <TextField
      select
      fullWidth
      variant="standard"
      className={noSwipingDesktop}
      label="Set Type"
      value={menuValue}
      InputLabelProps={{ shrink: true }}
      SelectProps={{
        open,
        readOnly,
        onOpen: () => setOpen(true),
        onClose: handleClose,
        displayEmpty: true,
        autoWidth: true,
        renderValue: () => (
          <Typography>
            {menuValue} <em>{remainingText}</em>
          </Typography>
        ),
        // Fix standard background, preventing gray shadow. See SelectFieldAutosave.
        variant: 'outlined',
      }}
      {...textFieldProps}
    >
      {/* allows menuValue to not be out of range */}
      <MenuItem value={menuValue} sx={{ display: 'none' }} />
      <Stack px={2} pt={1} direction="row" spacing={2}>
        <FormControl>
          <FormLabel id={`set-type-operator-radio-label`}>Operator</FormLabel>
          <RadioGroup
            aria-labelledby={`set-type-operator-radio-label`}
            name={`set-type-operator-radio`}
            value={operator}
            onChange={(_, newOperator) => {
              // "rest" only applies to time
              updateSetType({
                operator: newOperator as typeof operator,
                field: operator === 'rest' ? 'time' : field,
              })
            }}
          >
            {setOperators.map((setOperator) => (
              <FormControlLabel
                key={setOperator}
                value={setOperator}
                control={<Radio />}
                label={setOperator}
              />
            ))}
          </RadioGroup>
        </FormControl>
        {operator === 'between' ? (
          <Stack spacing={2}>
            <FormControl>
              <FormLabel htmlFor="set-type-min">Min</FormLabel>
              <NumericFieldAutosave
                renderAsInput
                id="set-type-min"
                initialValue={min}
                handleSubmit={(min) => updateSetType({ min })}
                InputProps={{ style: { margin: 0 } }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="set-type-max">Max</FormLabel>
              <NumericFieldAutosave
                renderAsInput
                id="set-type-max"
                initialValue={max}
                handleSubmit={(max) => updateSetType({ max })}
                InputProps={{ style: { margin: 0 } }}
              />
            </FormControl>
          </Stack>
        ) : (
          <FormControl>
            <FormLabel htmlFor="set-type-value">Value</FormLabel>
            <NumericFieldAutosave
              renderAsInput
              id="set-type-value"
              initialValue={value}
              handleSubmit={(value) => updateSetType({ value })}
              InputProps={{ style: { margin: 0 } }}
            />
          </FormControl>
        )}
        <FormControl>
          <FormLabel id={`set-type-field-radio-label`}>Field</FormLabel>
          <RadioGroup
            aria-labelledby={`set-type-field-radio-label`}
            name={`set-type-field-radio`}
            value={field}
            onChange={(_, newField) => {
              updateSetType({
                field: newField as typeof field,
              })
            }}
          >
            {fieldOptions.map((field) => (
              <FormControlLabel
                key={field.name}
                value={field.name}
                control={<Radio />}
                label={printFieldWithUnits(field, units)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Stack>
    </TextField>
  )
},
isEqual)
