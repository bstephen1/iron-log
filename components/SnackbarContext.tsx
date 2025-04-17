import type { AlertColor } from '@mui/material'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import AppSnackbar from './AppSnackbar'

interface SnackbarContext {
  showSnackbar: (message?: string, severity?: AlertColor) => void
}
const SnackbarContext = createContext<SnackbarContext>({
  showSnackbar: () => console.error('showSnackbar is not defined'),
})

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean
    message: string
    severity: AlertColor
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const showSnackbar = useCallback(
    (message: string = 'Changes saved', severity: AlertColor = 'success') => {
      setSnackbarState({ open: true, message, severity })
    },
    []
  )

  const handleClose = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }))
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <AppSnackbar {...snackbarState} handleClose={handleClose} />
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)
