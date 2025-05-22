import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'

export default function FormDivider({ title }: { title: string }) {
  const { palette } = useTheme()

  return (
    <Divider
      textAlign="center"
      sx={{
        pb: 1,
        width: '100%',
        '&::before, &::after': { borderColor: palette.primary.main },
      }}
    >
      {title}
    </Divider>
  )
}
