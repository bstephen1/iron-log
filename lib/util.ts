import { AutocompleteProps, UseAutocompleteProps } from '@mui/material'
import { useMemo } from 'react'
import { v4 as uuid, validate, version } from 'uuid'
import { NamedObject } from '../models/NamedObject'

// manually create a globally unique id across all tables. This should be used for ALL new records.
// We want to manually handle the IDs so that ID generation is not tied to the specific database being used,
// and to ensure no information is leaked from the ID (eg, userId=55 implies users 1-54 exist)
export function generateId() {
  return uuid()
}

// Currently enforcing that UUIDs are v4 but that may not be particularly useful.
// v4 is total random generation instead of using time / hardware to generate the uuid.
export function isValidId(id: string) {
  return validate(id) && version(id) === 4
}

// shortcut interface to bypass AutocompleteProps' unwieldy generic type
export interface GenericAutocompleteProps<T>
  extends AutocompleteProps<T, undefined, undefined, undefined> {}

// With AutocompleteProps only "any" works, but with UseAutocompleteProps we can say boolean | undefined.
export interface AutocompletePropsAny
  extends UseAutocompleteProps<
    any,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  > {}

// memoize mapping out the names so the mapping doesn't run every render
export const useNames = (entities?: NamedObject[]) =>
  useMemo(() => entities?.map((entity) => entity.name) || [], [entities])
