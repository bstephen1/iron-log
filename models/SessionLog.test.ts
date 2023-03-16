import SessionLog from './SessionLog'

it('inits with default values', () => {
  const date = '1970-01-01'

  expect(new SessionLog(date)).toMatchObject<SessionLog>({
    date,
    records: [],
    notes: [],
    _id: expect.any(String),
  })
})
