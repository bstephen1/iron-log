import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import useLocalStorageState from 'use-local-storage-state'

export default function SettingsPage() {
  const [sessionRedirect, setSessionRedirect] = useLocalStorageState(
    'sessionRedirect',
    { defaultValue: true }
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
            label="Session redirect"
          />
          <Typography variant="body2">
            Redirects to today's session when when navigating to the{' '}
            <Link href="/sessions" className="default-link">
              sessions page
            </Link>{' '}
            with no date in the url. Temporarily disabling this can be useful
            for directly bookmarking the redirect page.
          </Typography>
        </FormGroup>
      </Grid>
    </Grid>
  )
}
