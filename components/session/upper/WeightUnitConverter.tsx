import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { InputAdornment, Stack, TextField, TextFieldProps } from '@mui/material'
import { convertUnit } from 'models/Set'
import { useState } from 'react'

export default function WeightUnitConverter() {
  // the Textfield's value is a string, but it's based off kg here which is a number
  const [kg, setKg] = useState<number>()

  return (
    <Stack direction="row" sx={{ justifyContent: 'center' }}>
      <ConverterField
        unit="kg"
        value={kg ? convertUnit(kg, 'weight', 'kg', 'kg', 0, 2) : ''}
        onChange={(e) => setKg(e.target.value ? +e.target.value : undefined)}
      />
      <SyncAltIcon />
      <ConverterField
        unit="lb"
        value={kg ? convertUnit(kg, 'weight', 'kg', 'lbs', 0, 2) : ''}
        onChange={(e) =>
          setKg(
            e.target.value
              ? convertUnit(+e.target.value, 'weight', 'lbs', 'kg')
              : undefined
          )
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
