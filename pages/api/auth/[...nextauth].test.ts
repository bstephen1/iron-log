import { type Session } from 'next-auth/core/types'
import { type JWT } from 'next-auth/jwt'
import { expect, it, vi } from 'vitest'
import { devUserId } from '../../../lib/frontend/constants'
import { authOptions } from './[...nextauth]'

// provider options are typed as "any", so we can't avoid the eslint warnings
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

vi.mock('next-auth')
vi.mock('./[...nextauth].ts', async (importOriginal) => ({
  ...(await importOriginal()),
  default: vi.fn(),
}))

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
    // these are defined in env vars in vitest.setup.ts
    // could not get changes to stick editing the env vars in this file.
    // There is vi.stubEnv() but it was not working
    clientId: 'my id',
    clientSecret: 'secret secret',
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
