import Paper from '@mui/material/Paper'
import type { SxProps } from '@mui/material/styles'

export default function StyledDivider({
  sx,
  elevation = 3,
}: {
  sx?: SxProps
  elevation?: number
}) {
  return (
    <Paper
      sx={{
        height: 5,
        my: 2,
        bgcolor: (theme) => theme.palette.primary.light,
        ...sx,
      }}
      elevation={elevation}
    />
  )
}
