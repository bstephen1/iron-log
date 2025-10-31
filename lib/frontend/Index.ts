/** Index type includes undefined since lookup keys may not always be in the index */
type Index<T> = { [key: string]: T | undefined }

/** Takes an array of objects which each have a given index field and converts them to an object of objects indexed by the given field.
 * Index field values must be strings
 *
 * eg, indexing on _id: [{_id: '1', data: 'a'}] => {'1': {_id: '1', data: 'a'}}
 */
export const arrayToIndex = <T extends object>(
  index: keyof T,
  arr?: T[]
): Index<T> => {
  if (!arr) return {}

  return arr.reduce<Index<T>>((acc, cur) => {
    if (typeof cur[index] !== 'string') {
      throw new Error('Index field must be string')
    }

    acc[cur[index]] = cur
    return acc
  }, {})
}
