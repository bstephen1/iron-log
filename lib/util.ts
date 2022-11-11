import { AutocompleteProps, UseAutocompleteProps } from '@mui/material'
import { v4 as uuid } from 'uuid'

// manually create a globally unique id across all tables. This should be used for ALL new records.
// We want to manually handle the IDs so that ID generation is not tied to the specific database being used,
// and to ensure no information is leaked from the ID (eg, userId=55 implies users 1-54 exist)
export function generateId() {
  return uuid()
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
