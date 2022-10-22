import { Paper, SxProps, useTheme } from '@mui/material'

export default function StyledDivider({
  sx,
  elevation = 3,
}: {
  sx?: SxProps
  elevation?: number
}) {
  const theme = useTheme()
  const bgcolor =
    theme.palette.mode === 'light'
      ? `${theme.palette.primary.light}`
      : `${theme.palette.secondary.main}`
  const defaultSx: SxProps = { height: 5, my: 2, bgcolor: bgcolor }
  return <Paper sx={{ ...defaultSx, ...sx }} elevation={elevation} />
}
