import Note from './Note'

it('inits with default values', () => {
  const note = new Note()

  expect(note).toMatchObject<Note>({ tags: [], value: '' })
})
