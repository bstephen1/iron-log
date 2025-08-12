import Home from './page'
import { render, screen } from '../lib/testUtils'
import { expect, it } from 'vitest'

// testing links / routing should be done at the e2e level
it('renders', async () => {
  render(<Home />)

  expect(screen.getByText('Welcome')).toBeVisible()
})
