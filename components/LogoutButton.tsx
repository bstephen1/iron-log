import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'
import Tooltip from './Tooltip'

export default function LogoutButton() {
  const queryClient = useQueryClient()
  // Clearing cache on sign in/out ensures there isn't leftover data from local storage
  // if the user switches to a different account

  // todo: delete on sign in/out events? Currently it will only be cleared when clicking the sign out button.
  // [...next-auth] has "events" (setup like "callbacks") for signIn/signOut
  // which may be better since it's possible to sign in via api, not just this button.

  const clearCache = () => {
    queryClient.clear()
  }

  const handleSignout = async () => {
    clearCache()
    await signOut()
  }

  return (
    <Tooltip title="Sign out">
      <IconButton onClick={handleSignout}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  )
}
