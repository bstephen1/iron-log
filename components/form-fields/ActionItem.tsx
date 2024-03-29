import { Paper, Typography } from '@mui/material'

interface Props {
  button: JSX.Element
  description: string
}
export default function ActionItem({ button, description }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 1,
        my: 2,
      }}
    >
      <Typography display="flex" alignItems="center">
        {description}
      </Typography>
      {button}
    </Paper>
  )
}
