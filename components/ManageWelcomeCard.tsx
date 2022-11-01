import { Card, CardContent, Typography } from '@mui/material'

export default function ManageWelcomeCard() {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h5">Manage Exercises</Typography>
        <Typography variant="body2">
          Select an exercise in the dropdown to edit its values. Or, type in a
          new exercise to create it.
        </Typography>
      </CardContent>
    </Card>
  )
}
