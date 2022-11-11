// @ts-nocheck
// todo: Set structure is still under construction
import { Box, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import StandardSet from '../../../models/sets/StandardSet'
import NumericFieldAutosave from '../../form-fields/NumericFieldAutosave'

// todo: indicator for failing a rep
export default function StandardSetInput({
  type,
  handleSubmit,
  ...props
}: StandardSet & any) {
  // todo: restrict to numbers, but also allow undefined.
  // todo: changes based on type
  const placeholders = { primary: 'weight', secondary: 'reps', effort: 'rpe' }
  const units = { primary: 'kg', secondary: '', effort: '' }

  // todo: disable number scroll. Possibly use inputMode=decimal but that doesn't stop letters like type=number does

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
      justifyContent="space-between"
      // border is from TextField underline
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        background: `${grey[100]}`, // todo
        py: 0.5,
      }}
    >
      {inputs[0]}
      <Box px={1}>/</Box>
      {inputs[1]}
      <Box px={1}>@</Box>
      {inputs[2]}
    </Stack>
  )
}
