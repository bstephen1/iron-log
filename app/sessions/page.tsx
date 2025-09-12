'use client'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import LoadingSpinner from '../../components/loading/LoadingSpinner'
import { DATE_FORMAT, LOCAL_STORAGE } from '../../lib/frontend/constants'

export default function Page() {
  const router = useRouter()
  const [sessionRedirect, setSessionRedirect] = useLocalStorageState(
    LOCAL_STORAGE.sessionRedirect,
    // serverValue is the value on the initial render from the server.
    // We needed a distinct state separate from true/false to indicate "loading".
    // We cannot use undefined because then the hook just reuses defaultValue for
    // defaultServerValue. We need default values in case the value is not
    // saved in local storage yet.
    { defaultServerValue: null, defaultValue: true }
  )

  // need to wrap router.push in a useEffect because otherwise it would try to
  // render serverside and cause an error since the router doesn't exist yet.
  useEffect(() => {
    if (!sessionRedirect) return
    const today = dayjs().format(DATE_FORMAT)
    router.push(`sessions/${today}`)
  }, [router, sessionRedirect])

  return sessionRedirect !== false ? (
    <LoadingSpinner />
  ) : (
    <Stack py={2} spacing={2}>
      <Typography variant="h6" component="h1" py={1} textAlign="center">
        No Session
      </Typography>
      <Typography textAlign="center">
        Normally coming here would redirect to the page for today's session, but
        the redirect has been disabled.
      </Typography>
      <div></div>
      <Typography textAlign="center">
        Typically you might want to turn off the redirect temporarily to
        bookmark this page.
      </Typography>
      <Typography textAlign="center">
        You can re-enable the redirect through settings, or by clicking the
        button below.
      </Typography>
      <Box display="flex" justifyContent="center" py={1}>
        <Button onClick={() => setSessionRedirect(true)} variant="contained">
          Enable redirect
        </Button>
      </Box>
    </Stack>
  )
}
