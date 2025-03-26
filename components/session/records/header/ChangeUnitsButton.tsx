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
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import { UpdateFields, UpdateState } from '../../../../lib/util'
import { Exercise } from '../../../../models/AsyncSelectorOption/Exercise'
import { DisplayFields } from '../../../../models/DisplayFields'
import { Units, unitsSchema } from '../../../../models/Set'
import TooltipIconButton from '../../../TooltipIconButton'

interface Props {
  mutateExerciseFields: UpdateFields<Exercise>
  displayFields: DisplayFields
}
export default memo(function ChangeUnitsButton({
  mutateExerciseFields,
  displayFields,
}: Props) {
  const [open, setOpen] = useState(false)
  const { units } = displayFields
  // typescript doesn't recognize that Object.keys(obj) is in fact a list of keyof obj
  const dimensions = Object.keys(units) as Array<keyof typeof units>

  const handleChange: UpdateState<Units> = (changes) =>
    mutateExerciseFields({
      displayFields: {
        ...displayFields,
        units: { ...displayFields.units, ...changes },
      },
    })

  return (
    <>
      <TooltipIconButton title="Change units" onClick={() => setOpen(true)}>
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
        <DialogTitle>Change units</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {dimensions.map((dimension) => (
              <UnitDimensionRadioGroup
                key={dimension}
                dimension={dimension}
                value={units[dimension]}
                handleChange={handleChange}
              />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}, isEqual)

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
  const unitSymbols = Object.keys(unitsSchema.shape[dimension].Values)

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
