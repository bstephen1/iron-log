import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { NextAuthOptions, Session } from 'next-auth'
import NextAuth, { SessionStrategy } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import { clientPromise } from '../../../lib/backend/mongoConnect'
import { devUserId } from '../../../lib/frontend/constants'

const devProviders =
  process.env.NODE_ENV !== 'production'
    ? [
        // This provider logs on as the test user for dev mode.
        CredentialsProvider({
          id: 'dev',
          name: 'dev user',
          credentials: {},
          async authorize() {
            const user = { id: devUserId }

            // Any object returned will be saved in `user` property of the JWT
            return user
          },
        }),
      ]
    : []

// Allows users to sample the app without signing up.
// Seeded with dev data. This account is readonly.
const guestProvider = CredentialsProvider({
  id: 'guest',
  name: 'guest user',
  credentials: {},
  async authorize() {
    // session is only getting passed "name", "email", and "image" fields.
    // May be related to session() callback below
    return { id: devUserId, name: 'guest' }
  },
})

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID || '',
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET || '',
      id: 'github',
    }),
    guestProvider,
    ...devProviders,
  ],
  theme: {
    // todo: add logo
    // logo: '',
  },
  // using a database adapter changes the strategy to "database", which causes an infinite redirect loop.
  // See: https://github.com/nextauthjs/next-auth/issues/5392
  // Per the docs, jwt stores user session data in the client instead of in the database.
  // See: https://next-auth.js.org/adapters/overview
  session: { strategy: 'jwt' as SessionStrategy },
  // The official adapter uses an auto generated mongo ObjectId for the id.
  // We could define a custom adapter to use our own generateId() function but that adds a maintenance and complexity cost.
  // So for now we're going with the stock adapter and seeing if that causes issues.
  adapter: MongoDBAdapter(clientPromise),
  // By default the client receives only minimal information. Callbacks allow us to add needed properties to the client model.
  // (We want the id)
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      // token.sub is the mongo userId. Will never be undefined.
      session.user = { ...session.user, id: token.sub || '' }
      return session
    },
  },
}

// todo add some kind of splash screen
export default NextAuth(authOptions)
