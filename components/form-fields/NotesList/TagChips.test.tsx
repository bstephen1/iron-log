import { render, screen } from '../../../lib/testUtils'
import TagChips from './TagChips'

it('renders single tag', () => {
  render(<TagChips selected="tag" />)

  expect(screen.getByText('tag')).toBeVisible()
})

it('renders multiple tags', () => {
  render(<TagChips selected={['tag1', 'tag2']} multiple />)

  expect(screen.getByText('tag1')).toBeVisible()
  expect(screen.getByText('tag2')).toBeVisible()
})

it('shows singular no tag text when multiple is disabled', () => {
  render(<TagChips selected={[]} />)

  expect(screen.getByText('no tag')).toBeVisible()
})

it('shows plural no tags text when multiple is enabled', () => {
  render(<TagChips selected={[]} multiple />)

  expect(screen.getByText('no tags')).toBeVisible()
})
