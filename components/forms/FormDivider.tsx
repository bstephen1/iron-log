import { Divider, useTheme } from '@mui/material'

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
