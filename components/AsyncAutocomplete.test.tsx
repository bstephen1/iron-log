import { expect, it } from 'vitest'
import { render, screen } from '../lib/testUtils'
import AsyncAutocomplete from './AsyncAutocomplete'

it('shows loading only when menu is open', async () => {
  const { user } = render(<AsyncAutocomplete placeholder="open me" />)

  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

  await user.click(screen.getByPlaceholderText('open me'))

  expect(screen.getByRole('progressbar')).toBeVisible() // adornment spinner
  expect(screen.getByText('Loading...')).toBeVisible() // options text

  // close
  await user.keyboard('[Escape]')
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
})

it('shows loading always when prop is set', async () => {
  render(<AsyncAutocomplete alwaysShowLoading />)

  expect(screen.getByRole('progressbar')).toBeVisible()
})

it('does not open if adornment is open', async () => {
  const { user } = render(
    <AsyncAutocomplete
      placeholder="open me"
      options={['option 1']}
      adornmentOpen
    />
  )

  await user.click(screen.getByPlaceholderText('open me'))

  expect(screen.queryByText('option 1')).not.toBeInTheDocument()
})
