import Grid from '@mui/material/Grid'
import SessionRedirectSwitch from '../../components/SessionRedirectSwitch'

export default async function SettingsPage() {
  return (
    <Grid container spacing={2}>
      <Grid alignItems="center" display="flex" size={12}>
        <SessionRedirectSwitch />
      </Grid>
    </Grid>
  )
}
