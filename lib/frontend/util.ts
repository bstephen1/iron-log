import { enqueueSnackbar } from 'notistack'
import { ERRORS } from './constants'

export const enqueueError = (
  e: unknown,
  /** message to show if the error is a validation error */
  validationMessage: string
) => {
  const originalMessage = e instanceof Error ? e.message : ''

  enqueueSnackbar({
    message:
      originalMessage === ERRORS.validationFail
        ? validationMessage
        : ERRORS.retry,
    severity: 'error',
    persist: true,
  })
}
