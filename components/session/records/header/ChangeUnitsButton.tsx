import DesignServicesIcon from '@mui/icons-material/DesignServices'
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
import { DisplayFields } from 'models/DisplayFields'
import { UNITS, Units } from 'models/Set'
import { useState } from 'react'
import TooltipIconButton from '../../../TooltipIconButton'
import useCurrentRecord from '../useCurrentRecord'

interface Props {
  handleSubmit: (fields: DisplayFields) => void
}
export default function ChangeUnitsButton(props: Props) {
  const [open, setOpen] = useState(false)
  const { displayFields } = useCurrentRecord()
  const { units } = displayFields
  // typescript doesn't recognize that Object.keys(obj) is in fact a list of keyof obj
  const dimensions = Object.keys(units) as Array<keyof typeof units>

  const handleSubmit = (changes: Partial<Units>) =>
    props.handleSubmit({
      ...displayFields,
      units: { ...displayFields.units, ...changes },
    })

  return (
    <>
      <TooltipIconButton title="Change Units" onClick={() => setOpen(true)}>
        {/* it's proven pretty difficult to find a good "change units" icon...  */}
        <DesignServicesIcon />
      </TooltipIconButton>
      <Dialog
        open={open}
        fullWidth
        onClose={() => {
          setOpen(false)
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
            // todo: support HH:MM:SS
            disabled={symbol === 'HH:MM:SS'}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
