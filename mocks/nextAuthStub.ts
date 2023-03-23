// This took forever to debug the mysterious "jest unexpected parsing" error.
// The problem stems from next-auth's getServerSession and "providers" from
// authOptions, and some dependency that jest can't transform from ESM to
// CommonJS.
// See: https://github.com/nextauthjs/next-auth/issues/4866
//
// There aren't really many good options to deal with that, though.
// Manual mocks are impossible because they are required to be colocated
// with the mocked file, and we can't put anything in the pages folder.
// Mocking per test file works but is obviously untenable.
//
// This stub can be accessed via moduleNameMapper in jest.config.ts, which
// does successfully stub out next-auth, but it's more intended for static
// things like images so you can't actually export a mock. It may also not be
// overridable if something needs the real next-auth modules for testing.
const nextAuthStub = null
export default nextAuthStub

// Manual mocks for reference:
// jest.mock('pages/api/auth/[...nextauth]', () => ({
//     authOptions: { providers: [] },
//   }))
// jest.mock('next-auth', () => ({
//   getServerSession: () => ({ user: { id: '1234567890AB' } }),
// }))
