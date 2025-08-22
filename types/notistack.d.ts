import { type AppSnackbarProps } from '../components/AppSnackbar'

declare module 'notistack' {
  interface VariantOverrides {
    // remove built-in variants so the only option is default
    warning: false
    error: false
    success: false
    info: false
    // specify extra props allowed in `enqueueSnackbar`
    default: AppSnackbarProps
  }
}
