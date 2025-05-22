import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useSWRConfig } from 'swr'

export default function LoginButton() {
  const { cache } = useSWRConfig()

  // Clearing cache on sign in/out ensures there isn't leftover data from local storage
  // if the user switches to a different account

  // todo: delete on sign in/out events? Currently it will only be cleared when clicking the sign out button.
  // [...next-auth] has "events" (setup like "callbacks") for signIn/signOut
  // which may be better since it's possible to sign in via api, not just this button.
  // But you can't useSWRConfig to access the cache since that isn't a component.
  // And you can't access localStorage because it's server side.

  // Since the cache is a map, it technically has access to cache.clear(), but that
  // isn't officially listed in the Cache type.
  const clearCache = () => {
    for (const key of cache.keys()) {
      cache.delete(key)
    }
  }

  // this should actually never appear because of next-auth's middleware redirect
  const handleSignin = () => {
    clearCache()
    signIn(undefined, { callbackUrl: '/' })
  }

  const handleSignout = () => {
    clearCache()
    signOut()
  }

  const { status } = useSession()

  return (
    <Box>
      <Button
        loading={status === 'loading'}
        variant="contained"
        color="secondary"
        onClick={status === 'unauthenticated' ? handleSignin : handleSignout}
      >
        <span>Sign {status === 'unauthenticated' ? 'in' : 'out'}</span>
      </Button>
    </Box>
  )
}
