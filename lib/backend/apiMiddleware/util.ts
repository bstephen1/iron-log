import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { ApiError } from 'next/dist/server/api-utils'
import { authOptions } from '../../../pages/api/auth/[...nextauth]'

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
