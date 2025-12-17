import DesignServicesIcon from '@mui/icons-material/DesignServices'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import type { PartialUpdate } from '../../../../lib/types'
import type { DisplayFields } from '../../../../models/DisplayFields'
import { FACTORS, type Units } from '../../../../models/Units'
import TooltipIconButton from '../../../TooltipIconButton'
import { useExerciseUpdate } from '../useRecordUpdate'

interface Props {
  /** disabled if not provided */
  _id?: string
  displayFields: DisplayFields
}
export default memo(function ChangeUnitsButton({ _id, displayFields }: Props) {
  const [open, setOpen] = useState(false)
  const updateExercise = useExerciseUpdate(_id)
  const { units } = displayFields
  // typescript doesn't recognize that Object.keys(obj) is in fact a list of keyof obj
  const dimensions = Object.keys(units) as Array<keyof typeof units>

  const handleChange: PartialUpdate<Units> = (changes) =>
    updateExercise({
      displayFields: {
        ...displayFields,
        units: { ...displayFields.units, ...changes },
      },
    })

  return (
    <>
      <TooltipIconButton
        title="Change units"
        disabled={!_id}
        onClick={() => setOpen(true)}
      >
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
  const unitSymbols = Object.keys(FACTORS[dimension])

  // Don't render if there is only one option (eg, reps or side)
  if (unitSymbols.length < 2) {
    return null
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
