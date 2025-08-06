import Paper from '@mui/material/Paper'
import { type SxProps, useTheme } from '@mui/material/styles'

export default function StyledDivider({
  sx,
  elevation = 3,
}: {
  sx?: SxProps
  elevation?: number
}) {
  const theme = useTheme()
  const defaultSx: SxProps = {
    height: 5,
    my: 2,
    bgcolor: theme.palette.primary.light,
  }
  return <Paper sx={{ ...defaultSx, ...sx }} elevation={elevation} />
}
