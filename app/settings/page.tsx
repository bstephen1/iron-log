import Stack from '@mui/material/Stack'
import type { Metadata } from 'next'
import SavingIndicatorSwitch from '../../components/SavingIndicatorSwitch'
import SessionRedirectSwitch from '../../components/SessionRedirectSwitch'

export const metadata: Metadata = {
  title: 'Settings - Iron Log',
}

export default async function SettingsPage() {
  return (
    <Stack spacing={4}>
      <SessionRedirectSwitch />
      <SavingIndicatorSwitch />
    </Stack>
  )
}
