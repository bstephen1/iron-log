import { expect, it } from 'vitest'
import { render, screen } from '../lib/testUtils'
import Home from './page'

// testing links / routing should be done at the e2e level
it('renders', async () => {
  render(<Home />)

  expect(screen.getByText('Welcome')).toBeVisible()
})
