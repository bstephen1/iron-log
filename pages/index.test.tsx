import Home from '../pages/index.page'
import { render, screen } from '../lib/testUtils'

// testing links / routing should be done at the e2e level
it('renders', async () => {
  render(<Home />)

  expect(screen.getByText('Welcome')).toBeVisible()
})
