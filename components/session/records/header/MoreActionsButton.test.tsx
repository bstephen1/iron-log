import { expect, it } from 'vitest'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { createNote } from '../../../../models/Note'
import ExerciseNotesButton from './ExerciseNotesButton'
import MoreActionsButton from './MoreActionsButton'

it('stays open if child opens nested dialog', async () => {
  const { user } = render(
    <MoreActionsButton
      actions={[
        <ExerciseNotesButton key="dialog" notes={[createNote('my note')]} />,
      ]}
    />
  )

  await user.click(screen.getByLabelText('More...'))
  await user.click(screen.getByLabelText('Exercise notes'))

  expect(await screen.findByText('my note')).toBeVisible()

  await user.keyboard('[Escape]')
  // since the child is a nested dialog the parent stays mounted
  await waitFor(() => {
    expect(screen.getByLabelText('Exercise notes')).not.toBeVisible()
  })
})

// this is a bit of a hack to due to bizarre interactions with swiper and keepMounted.
// See comment in MoreActionsButton
it('requires nested dialog to have "dialog" in the key', async () => {
  const { user } = render(
    <MoreActionsButton
      actions={[
        <ExerciseNotesButton key="invalid" notes={[createNote('my note')]} />,
      ]}
    />
  )

  await user.click(screen.getByLabelText('More...'))
  await user.click(screen.getByLabelText('Exercise notes'))

  // opening nested dialog closes parent, which removes both from DOM
  expect(screen.queryByText('my note')).not.toBeInTheDocument()
})

it('does not render if there are no actions', async () => {
  render(<MoreActionsButton actions={[]} />)

  expect(screen.queryByLabelText('More...')).not.toBeInTheDocument()
})
