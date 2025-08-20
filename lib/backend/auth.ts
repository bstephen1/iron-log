import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

export const getUserId = async () => {
  const stringId = (await getServerSession(authOptions))?.user?.id

  if (!stringId || stringId.length !== 24) {
    redirect('/api/auth/signin')
  }

  return ObjectId.createFromHexString(stringId)
}
