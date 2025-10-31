/** Update some fields of an object, spreading over previous state  */
export type PartialUpdate<T> = (changes: Partial<T>) => void
