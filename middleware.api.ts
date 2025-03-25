// this will route to the login screen if not logged in
// see: https://next-auth.js.org/configuration/nextjs#middleware
export { default } from 'next-auth/middleware'

// config allows customizing which routes to redirect if not signed in
export const config = {
  matcher: [
    // Ignore routes in the api folder (using regex negative lookahead).
    // This allows api requests to return json.
    '/((?!api/).*)',
  ],
}
