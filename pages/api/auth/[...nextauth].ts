import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
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
  // todo: using an adapter changes the strategy to "database", which causes an infinite redirect loop.
  // Not sure what the difference is. See: https://github.com/nextauthjs/next-auth/issues/5392
  session: { strategy: 'jwt' as SessionStrategy },
  adapter: MongoDBAdapter(clientPromise),
}

// todo add some kind of splash screen
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return NextAuth(req, res, options)
}
