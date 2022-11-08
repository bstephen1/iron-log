import { Box, InputAdornment, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import StandardSet from '../../../models/sets/StandardSet'
import InputFieldAutosave from '../../form-fields/InputFieldAutosave'

// todo: indicator for failing a rep
export default function StandardSetInput({
  primary,
  secondary,
  effort,
  type,
  onSubmit,
  ...props
}: StandardSet & any) {
  // todo: restrict to numbers, but also allow undefined.
  // todo: changes based on type
  const placeholders = { primary: 'weight', secondary: 'reps', effort: 'rpe' }
  const units = { primary: 'kg', secondary: '', effort: '' }

  // todo: disable number scroll. Possibly use inputMode=decimal but that doesn't stop letters like type=number does

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      // border is from TextField underline
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        background: `${grey[100]}`, // todo
      }}
    >
      <InputFieldAutosave
        type="number"
        variant="standard"
        onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()} // prevent scrolling from incrementing the number. See: https://github.com/mui/material-ui/issues/7960
        defaultHelperText=""
        placeholder={placeholders.primary}
        initialValue={primary}
        onSubmit={(value) => onSubmit('primary', value)}
        inputProps={{ style: { textAlign: 'center' } }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">{units.primary}</InputAdornment>
          ),
        }}
      />
      <Box px={1}>/</Box>
      <InputFieldAutosave
        type="number"
        variant="standard"
        defaultHelperText=""
        placeholder={placeholders.secondary}
        initialValue={secondary}
        inputProps={{ style: { textAlign: 'center' } }}
        onSubmit={(value) => onSubmit('secondary', value)}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">{units.secondary}</InputAdornment>
          ),
        }}
      />
      <Box px={1}>@</Box>
      <InputFieldAutosave
        type="number"
        variant="standard"
        defaultHelperText=""
        placeholder={placeholders.effort}
        initialValue={effort}
        inputProps={{ style: { textAlign: 'center' } }}
        onSubmit={(value) => onSubmit('effort', value)}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">{units.effort}</InputAdornment>
          ),
        }}
      />
    </Stack>
  )
}
