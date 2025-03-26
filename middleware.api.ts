// this will route to the login screen if not logged in, from any route
// todo: might want to exclude pages/api so it can send json back instead of redirecting to sign in page
// see: https://next-auth.js.org/configuration/nextjs#middleware
export { auth as middleware } from './auth'
