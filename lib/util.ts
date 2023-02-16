import { AutocompleteProps, UseAutocompleteProps } from '@mui/material'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { v4 as uuid, validate, version } from 'uuid'
import { SelectorBaseOption } from '../models/SelectorBaseOption'
import { DATE_FORMAT } from './frontend/constants'

/** Manually create a globally unique id across all tables. This should be used for ALL new records.
 We want to manually handle the IDs so that ID generation is not tied to the specific database being used,
 and to ensure no information is leaked from the ID (eg, userId=55 implies users 1-54 exist)
 */
export const generateId = () => uuid()

/** Currently enforcing that UUIDs are v4 but that may not be particularly useful.
 v4 is total random generation instead of using time / hardware to generate the uuid.
 */
export const isValidId = (id: string) => validate(id) && version(id) === 4

/** shortcut interface to bypass AutocompleteProps' unwieldy generic type */
export interface GenericAutocompleteProps<T>
  extends AutocompleteProps<T, undefined, undefined, undefined> {}

/** With AutocompleteProps only "any" works, but with UseAutocompleteProps we can say boolean | undefined. */
export interface AutocompletePropsAny
  extends UseAutocompleteProps<
    any,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  > {}

/**  memoize mapping out the names so the mapping doesn't run every render */
export const useNames = (entities?: SelectorBaseOption[]) =>
  useMemo(() => entities?.map((entity) => entity.name) || [], [entities])

/** Takes an array of objects which each have a given index field and converts them to an object of objects indexed by the given field.
 * Index field values must be strings
 *
 * eg, indexing on _id: [{_id: '1', data: 'a'}] => {'1': {_id: '1', data: 'a'}}
 */
export const arrayToIndex = <T extends Object>(index: keyof T, arr?: T[]) => {
  const map = {} as { [key: string]: T }
  arr?.map((cur) => {
    if (typeof cur[index] !== 'string') {
      throw new Error('Index field must be string')
    }

    map[cur[index] as string] = cur
  })
  return map
}

export const dayjsStringAdd = (
  date: string,
  value: number,
  unit?: dayjs.ManipulateType | undefined
) => dayjs(date).add(value, unit).format(DATE_FORMAT)

export const formatTimeFromSeconds = (totalSeconds: number) => {
  const hours = ('0' + Math.floor(totalSeconds / 3600)).slice(-2)
  const minutes = ('0' + Math.floor((totalSeconds / 60) % 60)).slice(-2)
  const seconds = ('0' + Math.floor(totalSeconds % 60)).slice(-2)

  return `${hours}:${minutes}:${seconds}`
}
