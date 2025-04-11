import { render } from '../../lib/testUtils'
import ComboBoxField from './ComboBoxField'

const mockHandleChange = vi.fn()
const mockHandleSubmit = vi.fn()

it('', async () => {
  const option = 'option'
  const { user } = render(
    <ComboBoxField
      options={[option]}
      handleChange={mockHandleChange}
      handleSubmit={mockHandleSubmit}
    />
  )
})
