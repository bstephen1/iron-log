import { ZodError } from 'zod'

/** Error class returned from calls to the api.
 *  Based on ApiError from next/dist/server/api-utils
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    /** if the error is due to a validation issue,
     *  details will provide more info about what is
     *  malformed
     */
    public details?: ZodError[]
  ) {
    super(message)
  }
}
