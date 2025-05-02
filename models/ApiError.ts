import { StatusCodes } from 'http-status-codes'
import { type ZodError } from 'zod'

/** Error class returned from calls to the api.
 *  Based on ApiError from next/dist/server/api-utils
 */
export class ApiError extends Error {
  constructor(
    public statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    /** The message extends the base Error message, so it should always be
     *  accessed directly. If used in a spread it will not be visible.
     */
    public message = 'unknown error',
    /** if the error is due to a validation issue,
     *  details will provide more info about what is
     *  malformed
     */
    public details?: ZodError[]
  ) {
    super(message)
  }
}
