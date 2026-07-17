import type { Session } from 'next-auth/core/types'
import type { JWT } from 'next-auth/jwt'
import { expect, it, vi } from 'vitest'
import { devUserId } from './lib/frontend/constants'

vi.mock('next-auth')
const githubId = 'my id'
const githubSecret = 'secret secret'
vi.stubEnv('NEXTAUTH_GITHUB_ID', githubId)
vi.stubEnv('NEXTAUTH_GITHUB_SECRET', githubSecret)

// authOptions must be imported after the env var stubs are set up
// since it is a static object created at import
const { authOptions } = await import('./auth')

it('builds guest provider', async () => {
  const guestProvider = authOptions.providers.find(
    (provider) => provider.options?.id === 'guest'
  )

  expect(guestProvider).toBeTruthy()
  expect(await guestProvider?.options.authorize()).toMatchObject({
    id: devUserId,
  })
})

it('builds dev provider', async () => {
  const devProvider = authOptions.providers.find(
    (provider) => provider.options?.id === 'dev'
  )

  expect(devProvider).toBeTruthy()
  expect(await devProvider?.options.authorize()).toMatchObject({
    id: devUserId,
  })
})

it('builds github provider', async () => {
  const githubProvider = authOptions.providers.find(
    (provider) => provider.options?.id === 'github'
  )

  expect(githubProvider).toBeTruthy()
  // github's options have a different structure than dev/guest
  expect(await githubProvider?.options).toMatchObject({
    id: 'github',
    clientId: githubId,
    clientSecret: githubSecret,
  })
})

it('replaces session id with token id in session callback', async () => {
  const sessionObj: Session = { expires: '', user: { id: 'user id' } }
  const token: JWT = { sub: 'jwt id' }
  expect(
    await authOptions.callbacks?.session?.({
      session: sessionObj,
      token,
      // user only uses id
      user: {
        id: 'replaced id',
        email: '',
        emailVerified: null,
      },
      // unused fields
      newSession: undefined,
      trigger: 'update',
    })
  ).toMatchObject({ ...sessionObj, user: { id: token.sub } })
})
