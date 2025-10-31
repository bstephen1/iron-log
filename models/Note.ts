import { generateId } from '../lib/util/id'

export interface Note {
  _id: string
  value: string
  tags: string[]
}

export const createNote = (value = '', tags: string[] = []): Note => ({
  _id: generateId(),
  value,
  tags,
})
