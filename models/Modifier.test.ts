import Modifier from './Modifier'
import { Status } from './Status'

it('inits with default values', () => {
  const name = 'modifier'

  expect(new Modifier('modifier')).toMatchObject<Modifier>({
    name,
    status: Status.active,
    canDelete: true,
    _id: expect.any(String),
  })
})
