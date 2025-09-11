import NextAuth from 'next-auth'
import { authOptions } from '../../../auth'

// todo add some kind of splash screen
export default NextAuth(authOptions)
