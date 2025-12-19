import InputAdornment from '@mui/material/InputAdornment'
import { useCallback } from 'react'
import { DEFAULT_DISPLAY_FIELDS } from '../../models/DisplayFields'
import { convertUnit, DB_UNITS } from '../../models/Units'
import NumericFieldAutosave from './NumericFieldAutosave'

interface Props {
  weight?: number | null
  handleUpdate: (updates: { weight?: number | null }) => void
}
export default function EquipmentWeightField({ weight, handleUpdate }: Props) {
  const weightUnit = DEFAULT_DISPLAY_FIELDS.units.weight
  return (
    <NumericFieldAutosave
      label="Equipment weight"
      initialValue={convertUnit(
        weight ?? undefined,
        'weight',
        DB_UNITS.weight,
        weightUnit,
        0,
        2
      )}
      handleSubmit={useCallback(
        (weight) => {
          handleUpdate({
            weight: convertUnit(
              weight ?? null,
              'weight',
              weightUnit,
              DB_UNITS.weight
            ),
          })
        },
        [handleUpdate, weightUnit]
      )}
      fullWidth
      variant="outlined"
      defaultHelperText=" "
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">{weightUnit}</InputAdornment>
          ),
        },
      }}
    />
  )
}
