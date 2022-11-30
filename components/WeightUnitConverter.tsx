import { SyncAlt } from '@mui/icons-material'
import { InputAdornment, Stack, TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'

export default function WeightUnitConverter() {
  // the Textfield's value is a string, but it's based of kg here which is a number
  const [kg, setKg] = useState<number>()
  const KG_TO_LB_RATE = 2.2

  const format = (num: number) => +num.toFixed(2)

  return (
    <Stack direction="row" sx={{ justifyContent: 'center' }}>
      <ConverterField
        unit="kg"
        value={kg ? format(kg) : ''}
        onChange={(e) => setKg(e.target.value ? +e.target.value : undefined)}
      />
      <SyncAlt />
      <ConverterField
        unit="lb"
        value={kg ? format(kg * KG_TO_LB_RATE) : ''}
        onChange={(e) =>
          setKg(e.target.value ? +e.target.value / KG_TO_LB_RATE : undefined)
        }
      />
    </Stack>
  )
}

function ConverterField({
  unit,
  ...textFieldProps
}: { unit: 'lb' | 'kg' } & TextFieldProps) {
  return (
    <TextField
      {...textFieldProps}
      type="number"
      onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
      autoComplete="off"
      onFocus={(e) => e.target.select()}
      variant="standard"
      sx={{ width: 100, px: 2 }}
      InputProps={{
        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
      }}
    />
  )
}
