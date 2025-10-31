import { type QueryClient, useQueryClient } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'
import { expect, it, vi } from 'vitest'
import { render, screen } from '../lib/test/rtl'
import LogoutButton from './LogoutButton'

const mockSignOut = vi.fn(async () => undefined)
const mockClear = vi.fn()
vi.mock('@tanstack/react-query')
vi.mock('next-auth/react')

it('handles sign out', async () => {
  // cannot use mocks because Layout component requires them
  vi.mocked(signOut).mockImplementation(mockSignOut)
  vi.mocked(useQueryClient).mockImplementation(
    () => ({ clear: mockClear }) as unknown as QueryClient
  )
  const { user } = render(<LogoutButton />, { disableLayout: true })

  await user.click(screen.getByLabelText('Sign out'))

  expect(mockSignOut).toHaveBeenCalled()
  expect(mockClear).toHaveBeenCalled()
})
