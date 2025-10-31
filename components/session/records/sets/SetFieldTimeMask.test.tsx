import { expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '../../../../lib/util/test/rtl'
import SetFieldTimeMask from './SetFieldTimeMask'

const mockMutate = vi.fn()

it('updates time mask', async () => {
  const hours = 5
  const minutes = 33
  const seconds = 40
  const { user } = render(<SetFieldTimeMask handleSetChange={mockMutate} />)

  // basically impossible to detect, but when clicking the input in jsdom
  // the cursor will be all the way on the right, so you need to
  // manually move it back or the mask will ignore any input
  await user.click(screen.getByDisplayValue('00:00:00'))
  await user.keyboard('[Home]')
  // anything < 10 needs a prepended zero
  await user.paste(`0${hours}${minutes}${seconds}`)

  await waitFor(() => {
    expect(mockMutate).toHaveBeenCalledWith({
      time: hours * 3600 + minutes * 60 + seconds,
    })
  })
})

it('shows initial mask value', async () => {
  const hours = 13
  const minutes = 0
  const seconds = 45
  render(
    <SetFieldTimeMask
      handleSetChange={mockMutate}
      rawInitialValue={hours * 3600 + minutes * 60 + seconds}
    />
  )

  expect(
    screen.getByDisplayValue(`${hours}:0${minutes}:${seconds}`)
  ).toBeVisible()
})
