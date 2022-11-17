// @ts-nocheck
// todo: Set structure is still under construction
import { Clear } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import StandardSet from '../../../models/sets/StandardSet'
import NumericFieldAutosave from '../../form-fields/NumericFieldAutosave'

// todo: indicator for failing a rep
// todo: swipe to delete for xs screen; remove X button on xs too (keep swipe delete throughout?)
export default function StandardSetInput({
  type,
  handleSubmit,
  handleDelete,
  ...props
}: StandardSet & any) {
  // todo: restrict to numbers, but also allow undefined.
  // todo: changes based on type
  const placeholders = { primary: 'weight', secondary: 'reps', effort: 'rpe' }
  const units = { primary: 'kg', secondary: '', effort: '' }
  const pyStack = 0.5

  const inputs = ['primary', 'secondary', 'effort'].map((field) => (
    <NumericFieldAutosave
      key={field}
      placeholder={placeholders[field]}
      initialValue={props[field]}
      handleSubmit={(value) => handleSubmit(field, value)}
      units={units[field]}
    />
  ))

  return (
    <Stack
      direction="row"
      alignItems="center"
      // border is from TextField underline
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        background: `${grey[100]}`, // todo
        py: pyStack,
      }}
    >
      {inputs[0]}
      <Box px={1}>/</Box>
      {inputs[1]}
      <Box px={1}>@</Box>
      {inputs[2]}
      <IconButton
        size="small"
        onClick={handleDelete}
        sx={{
          my: -pyStack,
          p: 1,
          borderRadius: 0,
          '& .MuiTouchRipple-ripple .MuiTouchRipple-child': {
            borderRadius: 0,
          },
        }}
      >
        <Clear />
      </IconButton>
    </Stack>
  )
}
