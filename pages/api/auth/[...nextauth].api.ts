import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { AuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import { clientPromise } from '../../../lib/backend/mongoConnect'
import { devUserId } from '../../../lib/frontend/constants'

const isProd = process.env.NODE_ENV === 'production'
const devProvider =
  // This provider logs on as the test user for dev mode.
  Credentials({
    id: 'dev',
    name: 'dev user',
    credentials: {},
    // Any object returned will be saved in `user` property of the JWT
    async authorize() {
      return { id: devUserId }
    },
  })

// Allows users to sample the app without signing up.
// Seeded with dev data. This account is readonly.
const guestProvider = Credentials({
  id: 'guest',
  name: 'guest user',
  credentials: {},
  async authorize() {
    // session is only getting passed "name", "email", and "image" fields.
    // May be related to session() callback below
    return { id: devUserId, name: 'guest' }
  },
})

export const authOptions: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.NEXTAUTH_GITHUB_ID || '',
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET || '',
      id: 'github',
    }),
    guestProvider,
  ].concat(isProd ? [] : devProvider),
  theme: {
    // todo: add logo
    // logo: '',
  },
  // todo: look into database strategy. It is the default in v5, so this comment is probably outdated
  // using a database adapter changes the strategy to "database", which causes an infinite redirect loop.
  // See: https://github.com/nextauthjs/next-auth/issues/5392
  // Per the docs, jwt stores user session data in the client instead of in the database.
  // See: https://next-auth.js.org/adapters/overview
  session: { strategy: 'jwt' },
  // The official adapter uses an auto generated mongo ObjectId for the id.
  // We could define a custom adapter to use our own generateId() function but that adds a maintenance and complexity cost.
  // So for now we're going with the stock adapter and seeing if that causes issues.
  adapter: MongoDBAdapter(clientPromise),
  // By default the client receives only minimal information. Callbacks allow us to add needed properties to the client model.
  // (We want the id)
  callbacks: {
    async session({ session, token }) {
      // token.sub is the mongo userId. Will never be undefined.
      session.user = { ...session.user, id: token.sub || '' }
      return session
    },
  },
}

// todo add some kind of splash screen
export default NextAuth(authOptions)
