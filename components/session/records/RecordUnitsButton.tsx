import { FormatUnderlined } from '@mui/icons-material'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material'
import { useState } from 'react'
import { DisplayFields } from '../../../models/DisplayFields'
import { UNITS, Units } from '../../../models/Set'
import RecordHeaderButton from './RecordHeaderButton'

interface Props {
  displayFields: DisplayFields
  handleSubmit: (fields: DisplayFields) => void
}
export default function RecordUnitsButton({ displayFields, ...props }: Props) {
  const [open, setOpen] = useState(false)
  const { units } = displayFields
  // sure love that you have to specify that yes, Object.keys(obj) is in fact a list of keyof obj
  const dimensions = Object.keys(units) as Array<keyof typeof units>

  const handleSubmit = (changes: Partial<Units>) =>
    props.handleSubmit({
      ...displayFields,
      units: { ...displayFields.units, ...changes },
    })

  return (
    <>
      <RecordHeaderButton title="change units" onClick={() => setOpen(true)}>
        {/* todo: mui apparently has no kind of unit icon */}
        <FormatUnderlined />
      </RecordHeaderButton>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>Change Units</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {dimensions.map((dimension) => (
              <UnitDimensionRadioGroup
                key={dimension}
                dimension={dimension}
                value={units[dimension]}
                handleChange={handleSubmit}
              />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface UnitDimensionRadioGroupProps<Dimension extends keyof Units> {
  dimension: Dimension
  value: Units[Dimension]
  handleChange: (change: Partial<Units>) => void
}
function UnitDimensionRadioGroup<Dimension extends keyof Units>({
  dimension,
  value,
  handleChange,
}: UnitDimensionRadioGroupProps<Dimension>) {
  const unitSymbols = Object.keys(UNITS[dimension])

  return (
    <FormControl>
      <FormLabel id={`${dimension}-radio-buttons-label`}>{dimension}</FormLabel>
      <RadioGroup
        row
        aria-labelledby={`${dimension}-label`}
        name={`${dimension}-radio-buttons-label`}
        value={value}
        onChange={(_, value) => handleChange({ [dimension]: value })}
      >
        {unitSymbols.map((symbol) => (
          <FormControlLabel
            key={symbol}
            value={symbol}
            control={<Radio />}
            label={symbol}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
