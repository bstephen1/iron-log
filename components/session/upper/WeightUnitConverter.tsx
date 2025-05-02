import SyncAltIcon from '@mui/icons-material/SyncAlt'
import {
  type FilledInputProps,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { convertUnit } from '../../../models/Units'

export default function WeightUnitConverter() {
  // the Textfield's value is a string, but it's based off kg here which is a number.
  // We need to make sure any cases of undefined in value/onChange get mapped to an empty string.
  const [kg, setKg] = useState<number>()

  return (
    <Stack direction="row" sx={{ justifyContent: 'center' }}>
      <ConverterField
        unit="kg"
        value={convertUnit(kg, 'weight', 'kg', 'kg', 0, 2) ?? ''}
        onChange={(e) => setKg(e.target.value ? +e.target.value : undefined)}
      />
      <SyncAltIcon />
      <ConverterField
        unit="lb"
        value={convertUnit(kg, 'weight', 'kg', 'lbs', 0, 2) ?? ''}
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

interface ConverterFieldProps {
  unit: 'lb' | 'kg'
  // Manually listing the TextFieldProps instead of using Pick so value isn't typed as "unknown".
  // The input will convert everything to a string, but we want to directly pass in the number so
  // numbers aren't formatted while typing. Eg, String(1.0) formats to 1 so you wouldn't be able to type 1.05
  value: string | number
  onChange: FilledInputProps['onChange']
}
function ConverterField({ unit, ...textFieldProps }: ConverterFieldProps) {
  return (
    <TextField
      {...textFieldProps}
      autoComplete="off"
      onFocus={(e) => e.target.select()}
      variant="standard"
      sx={{ width: 100, px: 2 }}
      slotProps={{
        input: {
          endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
        },
        htmlInput: {
          // we need to add inputMode=decimal so ios devices will show a proper
          // decimal keyboard instead of the normal keyboard with a number row
          inputMode: 'decimal',
          // Decimal input will not work without type=number because it is converting the
          // input to a number on every keystroke, so it will drop any trailing decimals.
          // type=number will also add automatic validation, eg you can't input letters.
          type: 'number',
        },
      }}
    />
  )
}
