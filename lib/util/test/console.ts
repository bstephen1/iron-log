import { vi } from 'vitest'
import { doNothing } from '../../frontend/constants'

export const ignoreConsoleErrorOnce = () =>
  vi.spyOn(global.console, 'error').mockImplementationOnce(doNothing)
