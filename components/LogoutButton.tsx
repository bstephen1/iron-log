import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'
import Tooltip from './Tooltip'

export default function LogoutButton() {
  const queryClient = useQueryClient()
  // Clearing cache on sign in/out ensures there isn't leftover data from local storage
  // if the user switches to a different account

  // Note: you can sign out via /api/auth/signout, which will not trigger this.
  // Nextauth has "events.signout" available for authOptions but we cannot access
  // the existing browser queryClient there so there's no way to reset it.
  // In practice it seems like data is refreshed anyway. Could not force it
  // to leak data from another user.

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
