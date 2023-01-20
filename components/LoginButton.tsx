import { Box, Button } from '@mui/material'
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

  const { data: session } = useSession()

  return (
    <Box>
      {session && (
        <Button onClick={handleSignout} variant="contained" color="secondary">
          SIGN OUT
        </Button>
      )}
      {!session && (
        <Button onClick={handleSignin} variant="contained" color="secondary">
          SIGN IN
        </Button>
      )}
    </Box>
  )
}
