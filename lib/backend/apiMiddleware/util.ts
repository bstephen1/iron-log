import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { ApiError } from 'next/dist/server/api-utils'
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
  // Can't use NextApiRequest because getServerSideProps gives different req/res objects.
  // NextApiReq/Res extend these types though. They actually now match the object shape that
  // getServerSession is expecting exactly, whereas NextApiReq/Res have additional fields.
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
): Promise<UserId> {
  // req and res appear to be required. You can call the function without them but it won't work correctly.
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

  return new ObjectId(session.user.id)
}
