import { render, screen } from '../../../lib/testUtils'
import WeightUnitConverter from './WeightUnitConverter'

it('converts between kg and lbs with 2 decimal places', async () => {
  const { user } = render(<WeightUnitConverter />)

  const [kg, lbs] = screen.getAllByDisplayValue('')

  await user.click(kg)
  await user.paste('20.1')

  expect(screen.getByDisplayValue('44.31')).toBeVisible()

  // should select all on click, no need to backspace
  await user.click(lbs)
  await user.paste('45')

  expect(screen.getByDisplayValue('20.41')).toBeVisible()
})

// used to show zero instead of empty in the other input if you cleared out one of the inputs
it('can reset to empty without showing zeros', async () => {
  const { user } = render(<WeightUnitConverter />)

  const [kg, lbs] = screen.getAllByDisplayValue('')

  await user.click(kg)
  await user.paste('20')
  await user.clear(kg)

  expect(screen.getAllByDisplayValue('').length).toBe(2)

  await user.click(lbs)
  await user.paste('44')
  await user.clear(lbs)

  expect(screen.getAllByDisplayValue('').length).toBe(2)
})
