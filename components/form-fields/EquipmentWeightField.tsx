import { InputAdornment, InputProps } from '@mui/material'
import { memo, useCallback } from 'react'
import NumericFieldAutosave from './NumericFieldAutosave'

const inputProps: InputProps = {
  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
}

interface Props {
  weight?: number | null
  handleUpdate: (updates: { weight?: number | null }) => void
}
export default memo(function EquipmentWeightField({
  weight,
  handleUpdate,
}: Props) {
  return (
    <NumericFieldAutosave
      label="Equipment weight"
      initialValue={weight}
      handleSubmit={useCallback(
        (weight) => handleUpdate({ weight }),
        [handleUpdate],
      )}
      fullWidth
      variant="outlined"
      defaultHelperText=" "
      // todo: might want to make this selectable between lbs/kg
      InputProps={inputProps}
    />
  )
})
