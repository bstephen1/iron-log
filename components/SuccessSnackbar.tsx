import { Alert, Snackbar } from '@mui/material'
import { CustomContentProps, closeSnackbar } from 'notistack'
import { forwardRef } from 'react'

const AppSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  function AppSnackbar(props, ref) {
    const { message, variant = 'success', autoHideDuration, id } = props

    // Allows mui snackbar to signal to the notistack wrapper
    // to close the snackbar
    const handleClose = () => closeSnackbar(id)

    return (
      <Snackbar
        ref={ref}
        // notistack controls opening
        open
        // keep duration in sync with notistack's value
        autoHideDuration={autoHideDuration}
        // mui snackbar can close on pressing escape or when
        // its autoHideDuration expires.
        onClose={handleClose}
      >
        <Alert
          elevation={6}
          severity={variant === 'default' ? 'success' : variant}
          // adds a close button to the alert
          onClose={handleClose}
        >
          {message}
        </Alert>
      </Snackbar>
    )
  }
)

export default AppSnackbar
