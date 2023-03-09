import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
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
  handleClose: () => void
}
export default function RecordUnitsButton({
  displayFields,
  handleClose,
  ...props
}: Props) {
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
      <RecordHeaderButton title="Change Units" onClick={() => setOpen(true)}>
        {/* it's proven pretty difficult to find a good "change units" icon...  */}
        <FormatUnderlinedIcon />
      </RecordHeaderButton>
      <Dialog
        open={open}
        fullWidth
        onClose={() => {
          setOpen(false)
          handleClose()
        }}
      >
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

  // Don't render if there is only one option (eg, reps or side)
  if (unitSymbols.length < 2) {
    return <></>
  }

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
