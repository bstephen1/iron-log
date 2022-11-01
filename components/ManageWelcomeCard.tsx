import { Card, CardContent, Stack, Typography } from '@mui/material'

export default function ManageWelcomeCard() {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Stack spacing={2}>
          <Typography variant="h5">Manage Exercises</Typography>
          <Typography variant="body2">
            Select an exercise in the dropdown to edit its values. Or, type in a
            new exercise to create it.
          </Typography>
          <Typography variant="body2">
            Any edits will be saved automatically.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
