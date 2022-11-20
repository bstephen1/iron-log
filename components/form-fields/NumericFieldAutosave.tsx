import { InputAdornment } from '@mui/material'
import InputFieldAutosave, {
  InputFieldAutosaveProps,
} from './InputFieldAutosave'

// todo: split out from InputField so this can be number not string
type Props = {
  units?: string
} & InputFieldAutosaveProps
export default function NumericFieldAutosave({
  units,
  ...inputFieldAutosaveProps
}: Props) {
  return (
    <InputFieldAutosave
      {...inputFieldAutosaveProps}
      type="number"
      variant="standard"
      // prevent scrolling from incrementing the number. See: https://github.com/mui/material-ui/issues/7960
      onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
      defaultHelperText=""
      inputProps={{ style: { textAlign: 'center' } }}
      InputProps={{
        disableUnderline: true,
        endAdornment: <InputAdornment position="end">{units}</InputAdornment>,
      }}
    />
  )
}
