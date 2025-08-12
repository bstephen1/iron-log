import Grid from '@mui/material/Grid'
import SessionRedirectSwitch from '../../components/SessionRedirectSwitch'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

const test = () => {
  return getServerSession(authOptions)
}

export default async function SettingsPage() {
  console.log(await test())
  return (
    <Grid container spacing={2}>
      <Grid alignItems="center" display="flex" size={12}>
        <SessionRedirectSwitch />
      </Grid>
    </Grid>
  )
}
