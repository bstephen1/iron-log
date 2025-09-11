import NextAuth from 'next-auth'
import { authOptions } from '../../../../auth'

// next-auth has a v5 upgrade available but it breaks the app and will
// need effort to get working. We have partially migrated v4 to closely
// mimic the behavior of v5 (app router, separate auth.ts file) to minimize
// changes needed.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
