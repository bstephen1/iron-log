import { MongoDBAdapter } from '@auth/mongodb-adapter'
import type { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import { z } from 'zod'
import { clientPromise } from './lib/backend/mongoConnect'
import { devUserId, guestUserName } from './lib/frontend/constants'

const isProd =
  (process.env.NODE_ENV_OVERRIDE ?? process.env.NODE_ENV) === 'production'
const devProvider =
  // This provider logs on as the test user for dev mode.
  Credentials({
    id: 'dev',
    name: 'dev user',
    credentials: {
      id: {
        label: 'user id',
        type: 'text',
        placeholder: '24 digits. Uses default id if blank',
      },
    },
    // Any object returned will be saved in `user` property of the JWT
    async authorize(credentials) {
      // default value
      if (!credentials?.id) return { id: devUserId }

      const objectIdSchema = z
        .string()
        .length(24, 'id must be 24 characters')
        .optional()
        .default(devUserId)

      const parsedId = objectIdSchema.safeParse(credentials.id)

      if (parsedId.error) {
        console.error(z.treeifyError(parsedId.error), 'given: ', credentials.id)
        return null
      }

      return { id: parsedId.data }
    },
  })

// Allows users to sample the app without signing up.
// Seeded with dev data. This account is readonly.
const guestProvider = Credentials({
  id: 'guest',
  name: 'guest user',
  // we have to trick typescript into thinking this is the same type as devProvider
  // by manually specifying the generic type instead of letting it infer.
  credentials: {},
  async authorize() {
    // session is only getting passed "name", "email", and "image" fields.
    // May be related to session() callback below
    return { id: devUserId, name: guestUserName }
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
    ...(isProd ? [] : [devProvider]),
  ],
  theme: {
    // todo: add logo
    // logo: '',
  },
  // in v5, "database" is the default session strategy. Credentials providers are prevented
  // from using "database" strategy and must use JWT.
  session: { strategy: 'jwt' },
  // The official adapter uses an auto generated mongo ObjectId for the id.
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
