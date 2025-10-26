import { expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '../../../../lib/testUtils'
import RenderSetField from './RenderSetField'

const mockMutate = vi.fn()

it('updates numeric field', async () => {
  const delimiter = '%'
  const { user } = render(
    <RenderSetField
      index={1}
      handleSetChange={mockMutate}
      source="weight"
      unit="kg"
      value={5}
      delimiter={delimiter}
    />
  )

  expect(screen.getByText(delimiter)).toBeVisible()
  await user.type(screen.getByDisplayValue(5), '3') // weight

  // wait for debounce
  await waitFor(() => {
    expect(mockMutate).toHaveBeenCalledWith({ weight: 3 })
  })
})

it('updates numeric field with split weight', async () => {
  const { user } = render(
    <RenderSetField
      index={1}
      handleSetChange={mockMutate}
      name="totalWeight"
      source="weight"
      unit="kg"
      value={5}
      extraWeight={15}
    />
  )

  expect(screen.getByText('/')).toBeVisible() // default delimiter
  await user.type(screen.getByDisplayValue(20), '35') // total weight

  await waitFor(() => {
    // we're inputting the total weight, so have to subtract extra weight
    expect(mockMutate).toHaveBeenCalledWith({ weight: 20 })
  })
})

it('renders side field', async () => {
  render(
    <RenderSetField
      index={0}
      handleSetChange={mockMutate}
      source="side"
      unit="side"
      value="L"
    />
  )

  expect(screen.getByText('L')).toBeVisible()
})

it('renders time field', async () => {
  // note any digit < 10 will need to prepend a zero in the expect()
  const hours = 3
  const minutes = 15
  const seconds = 23
  render(
    <RenderSetField
      index={0}
      handleSetChange={mockMutate}
      source="time"
      unit="HH:mm:ss"
      value={hours * 3600 + minutes * 60 + seconds}
    />
  )

  expect(
    screen.getByDisplayValue(`0${hours}:${minutes}:${seconds}`)
  ).toBeVisible()
})
