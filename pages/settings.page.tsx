import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import useLocalStorageState from 'use-local-storage-state'

export default function SettingsPage() {
  const [sessionRedirect, setSessionRedirect] = useLocalStorageState(
    'sessionRedirect',
    { defaultValue: true },
  )
  return (
    <Grid container spacing={2}>
      <Grid alignItems="center" display="flex" size={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={sessionRedirect}
                onChange={() => setSessionRedirect(!sessionRedirect)}
              />
            }
            label="Redirect to today's session"
          />
          <Typography variant="body2">
            Redirect to today's session when when navigating to the sessions
            page with no date in the url. Disabling this can be useful for
            directly bookmarking the redirect page.
          </Typography>
        </FormGroup>
      </Grid>
    </Grid>
  )
}
