import { LoadingButton } from '@mui/lab'
import { Box } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
  const handleSignin = (e: any) => {
    e.preventDefault()
    signIn(undefined, { callbackUrl: '/' })
  }

  const handleSignout = (e: any) => {
    e.preventDefault()
    signOut()
  }

  const { status } = useSession()

  return (
    <Box>
      <LoadingButton
        loading={status === 'loading'}
        variant="contained"
        color="secondary"
        onClick={status === 'unauthenticated' ? handleSignin : handleSignout}
      >
        Sign {status === 'unauthenticated' ? 'in' : 'out'}
      </LoadingButton>
    </Box>
  )
}
