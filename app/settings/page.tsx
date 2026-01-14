import Stack from '@mui/material/Stack'
import type { Metadata } from 'next'
import SavingIndicatorSwitch from './SavingIndicatorSwitch'
import SessionRedirectSwitch from './SessionRedirectSwitch'

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
