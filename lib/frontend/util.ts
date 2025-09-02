import { enqueueSnackbar } from 'notistack'

export const enqueueError = (
  message: string,
  /** prints to console if provided */
  e?: unknown
) => {
  console.error(e)

  enqueueSnackbar({
    message,
    severity: 'error',
    persist: true,
  })
}
