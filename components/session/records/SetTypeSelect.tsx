import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
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
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import NumericFieldAutosave from '../../../components/form-fields/NumericFieldAutosave'
import { fixSelectBackground } from '../../../lib/frontend/constants'
import useNoSwipingDesktop from '../../../lib/frontend/useNoSwipingDesktop'
import { UpdateFields, UpdateState, stringifySetType } from '../../../lib/util'
import {
  ORDERED_DISPLAY_FIELDS,
  printFieldWithUnits,
} from '../../../models/DisplayFields'
import Record, { SetType, setOperators } from '../../../models/Record'
import { Units } from '../../../models/Set'

const normalFields = ORDERED_DISPLAY_FIELDS.filter(
  (field) => !field.enabled?.unilateral && !field.enabled?.splitWeight,
)

const timeField = ORDERED_DISPLAY_FIELDS.filter(
  (field) => field.source === 'time',
)

const valueInputStyle = { margin: 0, maxWidth: '80px' }
const standardVariantSx = { '& .MuiInput-input': { pr: '0px !important' } }

type Props = {
  /** considered readOnly if not provided */
  handleChange?: UpdateFields<Record> | UpdateState<Record>
  units: Units
  /** When nonzero, displays the given number as the total number of reps over all sets. */
  totalReps?: number
  setType: SetType
  /** shows remaining field value needed to reach total when "total" operator is active */
  showRemaining?: boolean
} & Partial<TextFieldProps>
export default memo(function SetTypeSelect({
  handleChange,
  totalReps = 0,
  units,
  setType,
  showRemaining,
  SelectProps,
  ...textFieldProps
}: Props) {
  const { field, value = 0, operator, min = 0, max = 0 } = setType
  const variant = textFieldProps.variant ?? 'standard'
  const fieldOptions = operator === 'rest' ? timeField : normalFields
  const remaining = (value ?? 0) - totalReps
  const isOverTotal = remaining < 0
  const remainingText =
    operator === 'total' && showRemaining
      ? ` (${Math.abs(remaining)} ${isOverTotal ? 'over' : 'remaining'})`
      : ''
  const noSwipingDesktop = useNoSwipingDesktop()
  const readOnly = !handleChange
  const [open, setOpen] = useState(false)
  const updateSetType: UpdateState<SetType> = (changes) => {
    const newSetType = { ...setType, ...changes }

    handleChange?.({ setType: newSetType })
  }

  const menuValue = stringifySetType(setType, units)

  const handleClose = () => setOpen(false)
  const handleOpen = () => !readOnly && setOpen(true)

  // todo: maybe store prev operator so when switching back from rest it changes back from "time" to whatever you had before
  return (
    <TextField
      select
      fullWidth
      variant={variant}
      className={noSwipingDesktop}
      label="Set type"
      value={menuValue}
      InputLabelProps={{ shrink: true }}
      // forcibly remove the input's padding. Select assumes the dropdown arrow
      // will be under the padding, but this leaves the arrow off center with autocomplete arrows.
      sx={variant === 'standard' ? standardVariantSx : undefined}
      SelectProps={{
        open,
        readOnly,
        // Rendering the icon as a separate component allows us to ignore the props it normally is passed.
        // These props make the icon off center with autocompletes when using standard variant.
        IconComponent:
          variant === 'standard'
            ? () => (
                <ArrowDropDownIcon
                  role="button"
                  // the manual onClick is needed if there's a swiper parent
                  onClick={handleOpen}
                  // match sx of normal icon
                  sx={{ opacity: 0.54, cursor: 'pointer' }}
                />
              )
            : undefined,
        // if this component has a swiper parent, this will not trigger bc swiper intercepts clicks
        // looking for drags on the swiper
        onOpen: handleOpen,
        onClose: handleClose,
        displayEmpty: true,
        autoWidth: true,
        renderValue: () => (
          // The props are needed for when there's a swiper parent, but are otherwise harmless.
          <Typography onClick={handleOpen} sx={{ role: 'button' }}>
            {menuValue} <em>{remainingText}</em>
          </Typography>
        ),
        ...fixSelectBackground,
        ...SelectProps,
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
                sx={{ mr: 0 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        {operator === 'between' ? (
          <Stack spacing={2}>
            <FormControl>
              <FormLabel htmlFor="set-type-min">Min</FormLabel>
              <NumericFieldAutosave
                // renderAsInput is needed so FormLabel is correctly attached to the input
                renderAsInput
                id="set-type-min"
                initialValue={min}
                handleSubmit={(min) => updateSetType({ min })}
                InputProps={{ style: valueInputStyle }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="set-type-max">Max</FormLabel>
              <NumericFieldAutosave
                renderAsInput
                id="set-type-max"
                initialValue={max}
                handleSubmit={(max) => updateSetType({ max })}
                InputProps={{ style: valueInputStyle }}
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
              InputProps={{
                style: valueInputStyle,
              }}
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
}, isEqual)
