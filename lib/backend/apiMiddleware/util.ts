import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { ApiError } from '../../../models/ApiError'
import { authOptions } from '../../../pages/api/auth/[...nextauth].api'

export type ApiHandler<T> = (
  req: NextApiRequest,
  userId: UserId
) => T | null | Promise<T | null>

export const methodNotAllowed = new ApiError(
  StatusCodes.METHOD_NOT_ALLOWED,
  'Method not allowed.'
)

export const recordNotFound = new ApiError(
  StatusCodes.NOT_FOUND,
  'Record not found.'
)

/** userId format for backend use. The frontend will not see the userId.
 * For mongo this is an ObjectId. */
export type UserId = ObjectId

/** Return the userId, formatted as a UserId. */
export async function getUserId(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<UserId> {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You must be logged in.')
  }

  if (session.user.id.length !== 24) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'user id must be a 24 character string, given "' + session.user.id + '"'
    )
  }

  return ObjectId.createFromHexString(session.user.id)
}
