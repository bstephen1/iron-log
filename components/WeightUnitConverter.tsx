import { SyncAlt } from '@mui/icons-material'
import { InputAdornment, Stack, TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'

export default function WeightUnitConverter() {
  const [kg, setKg] = useState<number>(0)
  const KG_TO_LB_RATE = 2.2

  const format = (num: number) => +num.toFixed(2)

  return (
    <Stack direction="row" sx={{ justifyContent: 'center' }}>
      <ConverterField
        type="kg"
        value={format(kg)}
        onChange={(e) => setKg(+e.target.value)}
      />
      <SyncAlt />
      <ConverterField
        type="lb"
        value={format(kg * KG_TO_LB_RATE)}
        onChange={(e) => setKg(+e.target.value / KG_TO_LB_RATE)}
      />
    </Stack>
  )
}

function ConverterField({
  type,
  ...textFieldProps
}: { type: 'lb' | 'kg' } & TextFieldProps) {
  return (
    <TextField
      {...textFieldProps}
      type="number"
      autoComplete="off"
      onFocus={(e) => e.target.select()}
      variant="standard"
      sx={{ width: 100, px: 2 }}
      InputProps={{
        endAdornment: <InputAdornment position="end">{type}</InputAdornment>,
      }}
    />
  )
}
