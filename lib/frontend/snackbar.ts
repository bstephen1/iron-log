import { enqueueSnackbar } from 'notistack'

/** we cannot print the error to console because
 *  for server functions react obfuscates the error in
 *  production to "avoid potential sensitive details".
 */
export const enqueueError = (message: string) => {
  enqueueSnackbar({
    message,
    severity: 'error',
    persist: true,
  })
}

export const enqueueSuccess = (message: string) => {
  enqueueSnackbar({
    message,
    severity: 'success',
  })
}
