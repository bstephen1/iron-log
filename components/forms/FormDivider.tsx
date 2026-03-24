import Divider from '@mui/material/Divider'

export default function FormDivider({ title }: { title: string }) {
  return (
    <Divider
      textAlign="center"
      sx={{
        pb: 1,
        width: '100%',
        '&::before, &::after': {
          borderColor: (theme) => theme.palette.primary.light,
        },
      }}
    >
      {title}
    </Divider>
  )
}
