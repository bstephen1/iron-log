import SaveIcon from '@mui/icons-material/Save'
import Box from '@mui/material/Box'
import { keyframes } from '@mui/material/styles'
import { useIsMutating } from '@tanstack/react-query'
import useLocalStorageState from 'use-local-storage-state'
import { LOCAL_STORAGE } from '../lib/frontend/constants'

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.1; }
`

// todo: could add a "pending" state for debounced saves to show data has not yet
// attempted to save
export default function SavingIndicator() {
  const currentMutations = useIsMutating()
  const [showSaving] = useLocalStorageState(LOCAL_STORAGE.showSaving, {
    defaultValue: !!process.env.NEXT_PUBLIC_SHOW_SAVING,
  })

  if (!showSaving) return <></>

  return (
    <Box
      aria-label={currentMutations ? 'Saving...' : 'Changes saved'}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
      }}
    >
      {!!currentMutations && (
        <SaveIcon
          color="primary"
          sx={{
            animation: `${blink} 2s linear infinite`,
          }}
        />
      )}
    </Box>
  )
}
