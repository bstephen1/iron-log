import Stack from '@mui/material/Stack'
import SavingIndicatorSwitch from '../../components/SavingIndicatorSwitch'
import SessionRedirectSwitch from '../../components/SessionRedirectSwitch'

export default async function SettingsPage() {
  return (
    <Stack spacing={4}>
      <SessionRedirectSwitch />
      <SavingIndicatorSwitch />
    </Stack>
  )
}
