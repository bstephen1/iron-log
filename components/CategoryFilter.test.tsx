import { useState } from 'react'
import { expect, it } from 'vitest'
import { render, screen } from '../lib/testUtils'
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
  expect(screen.getByText('cat')).toBeVisible()

  await user.click(screen.getByTestId('CancelIcon'))
  expect(screen.queryByText('cat')).not.toBeInTheDocument()
})
