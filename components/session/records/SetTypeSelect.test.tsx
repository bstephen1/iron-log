import { type ComponentProps, useState } from 'react'
import { expect, it } from 'vitest'
import { render, screen } from '../../../lib/test/rtl'
import { DEFAULT_SET_TYPE } from '../../../models/Set'
import { DB_UNITS } from '../../../models/Units'
import SetTypeSelect from './SetTypeSelect'

const TestWrapper = (props: Partial<ComponentProps<typeof SetTypeSelect>>) => {
  const [setType, setSetType] = useState(props.setType ?? DEFAULT_SET_TYPE)
  return (
    <SetTypeSelect
      handleChange={({ setType: changes }) =>
        setSetType((prev) => ({ ...prev, ...changes }))
      }
      units={DB_UNITS}
      setType={setType}
      {...props}
    />
  )
}

it('preserves previous field when switching to time-only field', async () => {
  const { user } = render(<TestWrapper />)

  await user.click(screen.getByLabelText('Set type'))
  await user.click(screen.getByDisplayValue('weight'))

  await user.click(screen.getByText('rest'))
  expect(screen.getByDisplayValue('time')).toBeChecked()

  await user.click(screen.getByText('exactly'))
  expect(screen.getByDisplayValue('weight')).toBeChecked()
})

it('preserves singular value after changing min/max', async () => {
  const { user } = render(<TestWrapper />)

  await user.click(screen.getByLabelText('Set type'))

  await user.type(screen.getByLabelText('Value'), '2')

  await user.click(screen.getByText('between'))
  await user.type(screen.getByLabelText('Min'), '5')
  await user.type(screen.getByLabelText('Max'), '8')

  await user.click(screen.getByText('exactly'))
  expect(screen.getByDisplayValue('2')).toBeVisible()
})

it('shows reps remaining for total reps', async () => {
  render(
    <TestWrapper
      setType={{ ...DEFAULT_SET_TYPE, operator: 'total', value: 25 }}
      totalReps={5}
      showRemaining
    />
  )

  expect(screen.getByText(/20 remaining/)).toBeVisible()
})

it('shows reps over total reps', async () => {
  render(
    <TestWrapper
      setType={{ ...DEFAULT_SET_TYPE, operator: 'total', value: 20 }}
      totalReps={27}
      showRemaining
    />
  )

  expect(screen.getByText(/7 over/)).toBeVisible()
})
