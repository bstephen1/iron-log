import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { SessionStrategy } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { clientPromise } from '../../../lib/backend/mongoConnect'

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  database: process.env.DATABASE_URL || '',
  // using a database adapter changes the strategy to "database", which causes an infinite redirect loop.
  // See: https://github.com/nextauthjs/next-auth/issues/5392
  // Per the docs, jwt seems to store user session data in the client instead of in the database.
  // So seems like it should be fine? See: https://next-auth.js.org/adapters/overview
  session: { strategy: 'jwt' as SessionStrategy },
  // The official adapter uses an auto generated mongo ObjectId for the id.
  // We could define a custom adapter to use our own generateId() function but that adds a maintenance and complexity cost.
  // So for now we're going with the stock adapter and seeing if that causes issues.
  adapter: MongoDBAdapter(clientPromise),
  // By default the client receives only minimal information. Callbacks allow us to add needed properties to the client model.
  // (We want the id)
  callbacks: {
    // called whenever a session is checked
    // todo: does this have better typing?
    async session({ session, token }: { session: any; token: any }) {
      // in dev mode we can set an arbitrary id for testing
      if (process.env.NEXTAUTH_DUMMY_SESSION_ID) {
        const userObjectId = new ObjectId(process.env.NEXTAUTH_DUMMY_SESSION_ID)
        session.user.id = userObjectId.toString()
        return session
      }

      // for some reason the mongo id is stored under token.sub
      session.user.id = token.sub
      return session
    },
  },
}

// todo add some kind of splash screen
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return NextAuth(req, res, options)
}
