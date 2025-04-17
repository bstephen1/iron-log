import { Alert, AlertColor, Snackbar } from '@mui/material'
import { CustomContentProps, closeSnackbar } from 'notistack'
import { forwardRef } from 'react'

export type AppSnackbarProps = {
  /** defaults to success */
  severity?: AlertColor
}

const AppSnackbar = forwardRef<
  HTMLDivElement,
  AppSnackbarProps & CustomContentProps
>(function AppSnackbar(props, ref) {
  const { message, severity, autoHideDuration, id } = props

  // signals to the notistack wrapper to close the snackbar
  const handleClose = () => closeSnackbar(id)

  return (
    <Snackbar
      ref={ref}
      // notistack controls opening
      open
      // keep duration in sync with notistack's value
      autoHideDuration={autoHideDuration}
      // mui snackbar has three close triggers:
      // timeout, clickaway, escapeKeyDown (notistack only has timeout)
      onClose={handleClose}
      sx={{
        justifyContent: 'center',
        position: 'static',
      }}
    >
      <Alert
        elevation={6}
        severity={severity}
        // adds a close button to the alert
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  )
})

export default AppSnackbar
