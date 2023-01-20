import { DefaultSession } from 'next-auth'

// Module augmentation for next-auth types.
// See: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      /** The user's id */
      id: string
    } & DefaultSession['user']
  }
}
