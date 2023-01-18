import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { ApiError } from 'next/dist/server/api-utils'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { validDateStringRegex } from '../../frontend/constants'

export type ApiQuery = string | string[] | undefined
export interface ApiResponse {
  statusCode?: number
  payload?: object
}

export type ApiHandler = (
  req: NextApiRequest,
  userId: string
) => ApiResponse | Promise<ApiResponse>

export const emptyApiResponse = {} as ApiResponse

export const methodNotAllowed = new ApiError(
  StatusCodes.METHOD_NOT_ALLOWED,
  'method not allowed'
)

export async function getUserId(req: NextApiRequest, res: NextApiResponse) {
  // req and res appear to be required. You can call the function without them but it won't work correctly.
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You must be logged in.')
  }

  return session.user.id
}

/** validate a date */
export function valiDate(date: ApiQuery) {
  if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Date must be formatted as YYYY-MM-DD'
    )
  }

  return date
}

// todo: (if needed)
// export function validateString(string: ApiQuery, required = true) {
//   if (required && !string)
// }
