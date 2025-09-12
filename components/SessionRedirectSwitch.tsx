'use client'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import useLocalStorageState from 'use-local-storage-state'
import useDarkMode from '../components/useDarkMode'
import { LOCAL_STORAGE } from '../lib/frontend/constants'

export default function SessionRedirectSwitch() {
  const [sessionRedirect, setSessionRedirect] = useLocalStorageState(
    LOCAL_STORAGE.sessionRedirect,
    { defaultValue: true }
  )
  const theme = useTheme()
  const isDark = useDarkMode()

  return (
    <FormGroup>
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
        <Link
          href="/sessions"
          style={{
            color: theme.palette.primary[isDark ? 'light' : 'main'],
            textDecoration: 'underline',
          }}
        >
          sessions page
        </Link>{' '}
        with no date in the url. Temporarily disabling this can be useful for
        directly bookmarking the redirect page.
      </Typography>
    </FormGroup>
  )
}
