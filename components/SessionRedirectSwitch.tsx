'use client'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import { useTheme } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import useLocalStorageState from 'use-local-storage-state'
import useDarkMode from '../components/useDarkMode'

export default function SessionRedirectSwitch() {
  const [sessionRedirect, setSessionRedirect] = useLocalStorageState(
    'sessionRedirect',
    { defaultValue: true }
  )
  const theme = useTheme()
  const isDark = useDarkMode()

  return (
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
