import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],

  database: process.env.DATABASE_URL || '',
}

// todo add some kind of splash screen
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return NextAuth(req, res, options)
}
