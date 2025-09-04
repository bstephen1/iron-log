import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

export const getUserId = async () => {
  const stringId = (await getServerSession(authOptions))?.user?.id

  if (!stringId || stringId.length !== 24) {
    // this should never happen since middleware.ts ensures user is signed in
    throw new Error('must be logged in')
  }

  return ObjectId.createFromHexString(stringId)
}
