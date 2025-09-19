import Alert, { type AlertColor } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { type CustomContentProps, closeSnackbar } from 'notistack'
import { forwardRef } from 'react'

export type AppSnackbarProps = {
  /** renders an alert of the given severity */
  severity?: AlertColor
  /** NOTE: AppSnackbar ignores this prop */
  action?: null
}
const AppSnackbar = forwardRef<
  HTMLDivElement,
  AppSnackbarProps & CustomContentProps
>(function AppSnackbar(props, ref) {
  const { message, severity, autoHideDuration, id, persist } = props

  // signals to the notistack wrapper to close the snackbar
  const handleClose = () => closeSnackbar(id)

  return (
    <Snackbar
      ref={ref}
      // notistack controls opening
      open
      // keep duration in sync with notistack's value
      autoHideDuration={persist ? null : autoHideDuration}
      // mui snackbar has three close triggers:
      // timeout, clickaway, escapeKeyDown (notistack only has timeout)
      onClose={handleClose}
      sx={{
        justifyContent: 'center',
        position: 'static',
      }}
      // these props only display when the child Alert is not present
      message={message}
    >
      {severity ? (
        <Alert
          elevation={6}
          severity={severity}
          // Adds a close button to the alert.
          // Only necessary if the alert will not close by timeout
          onClose={persist ? handleClose : undefined}
          // ensure width is responsive -- snackbar automatically uses
          // full screen width on small screens
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      ) : undefined}
    </Snackbar>
  )
})

export default AppSnackbar
