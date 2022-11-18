// todo: Set structure is still under construction
import { Clear } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import { DEFAULT_SET_LAYOUT, DEFAULT_UNITS } from '../../lib/frontend/constants'
import Set, { SetLayout } from '../../models/Set'
import NumericFieldAutosave from '../form-fields/NumericFieldAutosave'

// todo: indicator for failing a rep
// todo: swipe to delete for xs screen; remove X button on xs too (keep swipe delete throughout?)
export default function StandardSetInput({
  type,
  handleSubmit,
  handleDelete,
  ...props
}: Set & any) {
  // todo: restrict to numbers, but also allow undefined.
  // todo: changes based on type
  const units = DEFAULT_UNITS
  const layout = DEFAULT_SET_LAYOUT
  const pyStack = 0.5

  const inputs = Object.keys(layout).map((field) => (
    <NumericFieldAutosave
      key={field}
      placeholder={field}
      initialValue={props[field]}
      handleSubmit={(value) => handleSubmit(field, value)}
      units={units[field]}
    />
  ))

  console.log(inputs)

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
