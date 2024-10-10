import SyncAltIcon from '@mui/icons-material/SyncAlt'
import { InputAdornment, Stack, TextField, TextFieldProps } from '@mui/material'
import { useState } from 'react'
import { convertUnit } from '../../../models/Set'

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
              : undefined,
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
      // Decimal input will not work without type=number because it is converting the
      // input to a number on every keystroke, so it will drop any trailing decimals.
      // type=number will also add automatic validation, eg you can't input letters.
      type="number"
      autoComplete="off"
      onFocus={(e) => e.target.select()}
      variant="standard"
      sx={{ width: 100, px: 2 }}
      inputProps={{
        // we need to add inputMode=decimal so ios devices will show a proper
        // decimal keyboard instead of the normal keyboard with a number row
        inputMode: 'decimal',
        ...textFieldProps.inputProps,
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
      }}
    />
  )
}
