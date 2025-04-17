import { Alert, AlertColor, Snackbar } from '@mui/material'

type Props = {
  open: boolean
  message: string
  severity: AlertColor
  handleClose: () => void
}
export default function AppSnackbar({
  open,
  message,
  severity,
  handleClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        elevation={6}
        severity={severity}
        onClose={handleClose}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
