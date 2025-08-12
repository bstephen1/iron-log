import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { ApiError } from '../../models/ApiError'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

export const getUserId = async () => {
  const stringId = (await getServerSession(authOptions))?.user?.id
  if (!stringId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You must be logged in.')
  }

  if (stringId.length !== 24) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'user id must be a 24 character string, given "' + stringId + '"'
    )
  }

  return ObjectId.createFromHexString(stringId)
}
