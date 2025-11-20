import { useState } from 'react'
import { expect, it } from 'vitest'
import { render, screen } from '../lib/test/rtl'
import CategoryFilter from './CategoryFilter'

const TestComponent = (
  props: { category?: string; categories?: string[] } = {}
) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [category, setCategory] = useState(props.category ?? null)

  return (
    <CategoryFilter
      categories={props.categories}
      {...{ category, setCategory, anchorEl, setAnchorEl }}
    />
  )
}

it('selects a category', async () => {
  const { user } = render(<TestComponent categories={['cat', 'other']} />)

  await user.click(screen.getByLabelText('Select category'))
  await user.click(screen.getByText('cat'))

  expect(screen.queryByText('other')).not.toBeInTheDocument()

  await user.click(screen.getByText('cat'))
  await user.click(screen.getByText('No category'))
  expect(screen.queryByText('cat')).not.toBeInTheDocument()
})

it('deletes a category chip', async () => {
  const { user } = render(
    <TestComponent categories={['other']} category="other" />
  )

  await user.click(screen.getByTestId('CancelIcon'))

  expect(screen.queryByText('other')).not.toBeInTheDocument()
})
