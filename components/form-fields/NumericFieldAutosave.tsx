import { InputAdornment } from '@mui/material'
import InputFieldAutosave, {
  InputFieldAutosaveProps,
} from './InputFieldAutosave'

interface Props extends InputFieldAutosaveProps {
  units?: string
}
export default function NumericFieldAutosave({ units, ...props }: Props) {
  return (
    <InputFieldAutosave
      {...props}
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
