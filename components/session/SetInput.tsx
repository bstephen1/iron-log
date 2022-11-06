import { Box, InputAdornment, Stack, TextField, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useState } from 'react'
import Set from '../../models/Set'

// todo: indicator for failing a rep
// todo: fix NaN from tel
export default function SetInput(props: Set) {
  const [weight, setWeight] = useState(props.weight)
  const [reps, setReps] = useState(props.reps)
  const [rpe, setRpe] = useState(props.rpe)

  // todo: restrict to numbers, but also allow undefined.

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
      {/* use type tel instead of number so there's no increment on scroll */}
      <TextField
        type="number"
        variant="standard"
        placeholder="weight"
        value={weight}
        onChange={(e) => +e.target.value && setWeight(+e.target.value)}
        InputProps={{
          disableUnderline: true,
          endAdornment: <InputAdornment position="end">kg</InputAdornment>,
        }}
      />
      <Box px={1}>/</Box>
      <TextField
        type="number"
        variant="standard"
        placeholder="reps"
        value={reps}
        onChange={(e) => setReps(+e.target.value)}
        InputProps={{ disableUnderline: true }}
      />
      <Box px={1}>@</Box>
      <TextField
        type="number"
        variant="standard"
        placeholder="rpe"
        value={rpe}
        onChange={(e) => setRpe(+e.target.value)}
        InputProps={{ disableUnderline: true }}
      />
    </Stack>
  )
}
