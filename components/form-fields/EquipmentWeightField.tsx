import { memo, useCallback } from 'react'
import NumericFieldAutosave from './NumericFieldAutosave'
import { InputAdornment, InputProps } from '@mui/material'

const inputProps: InputProps = {
  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
}

interface Props {
  initialValue?: number | null
  handleUpdate: (updates: { weight?: number | null }) => void
}
export default memo(function EquipmentWeightField({
  initialValue,
  handleUpdate,
}: Props) {
  return (
    <NumericFieldAutosave
      label="Equipment weight"
      initialValue={initialValue}
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
