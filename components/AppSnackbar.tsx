import { Alert, AlertColor, Button, Snackbar } from '@mui/material'
import { CustomContentProps, closeSnackbar } from 'notistack'
import { forwardRef } from 'react'

export type AppSnackbarProps = {
  /** renders an alert of the given severity */
  severity?: AlertColor
  action?: { text: string; onClick: () => void }
}
const AppSnackbar = forwardRef<
  HTMLDivElement,
  AppSnackbarProps & CustomContentProps
>(function AppSnackbar(props, ref) {
  const { message, severity, autoHideDuration, id, action, persist } = props

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
      action={
        action ? (
          <Button color="secondary" size="small" onClick={action.onClick}>
            {action.text}
          </Button>
        ) : undefined
      }
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
