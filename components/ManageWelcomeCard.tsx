import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export default function ManageWelcomeCard() {
  return (
    <Stack spacing={2} sx={{ textAlign: 'center' }}>
      <Typography variant="h5">Manage Exercises</Typography>
      <Typography variant="body2">
        Here you can edit your bank of available exercises and their categories
        / modifiers.
      </Typography>
      <Typography variant="body2">
        Select an item in the dropdown to edit its values. Or, type in something
        new to create it.
      </Typography>
      <Typography variant="body2">
        Any edits to "name" fields must be manually confirmed. All other edits
        are saved automatically.
      </Typography>
    </Stack>
  )
}
