import { capitalize } from '../lib/util'
import { DB_UNITS, Set, Units } from './Set'

/** signifies which Set fields are visible, and which units they are using.  */
export type DisplayFields = {
  /** ordered array that denotes which fields are active and in what order */
  visibleFields: VisibleField[]
  /** must have units for all fields, not just visible ones.  */
  units: Units
}

// todo: dnd this? user pref? per exercise?
export const ORDERED_DISPLAY_FIELDS: readonly VisibleField[] = [
  { name: 'side', source: 'side', enabled: { unilateral: true } },
  { name: 'weight', source: 'weight', enabled: { splitWeight: false } },
  {
    name: 'plateWeight',
    source: 'weight',
    label: 'Plate Weight',
    unitPrefix: 'PW ',
    enabled: { splitWeight: true },
  },
  {
    name: 'totalWeight',
    source: 'weight',
    label: 'Total Weight',
    unitPrefix: 'TW ',
    enabled: { splitWeight: true },
  },
  { name: 'distance', source: 'distance' },
  { name: 'time', source: 'time' },
  { name: 'reps', source: 'reps' },
  { name: 'effort', source: 'effort', delimiter: '@' },
] as const

/** display fields to use when no others are found. Currently does not change but
 * may be user editable down the line
 */
export const DEFAULT_DISPLAY_FIELDS: DisplayFields = {
  visibleFields: ORDERED_DISPLAY_FIELDS.filter((field) =>
    (['weight', 'reps', 'effort'] as VisibleField['name'][]).includes(
      field.name
    )
  ),
  units: DB_UNITS,
} as const

export const why = 'why'

export const DEFAULT_DISPLAY_FIELDS_SPLIT_WEIGHT: DisplayFields = {
  visibleFields: ORDERED_DISPLAY_FIELDS.filter((field) =>
    (
      ['plateWeight', 'totalWeight', 'reps', 'effort'] as VisibleField['name'][]
    ).includes(field.name)
  ),
  units: DB_UNITS,
} as const

export interface VisibleField {
  /** unique identifier for the field */
  name: keyof Set | 'plateWeight' | 'totalWeight'
  /** The visible label. Only needed if it is different than "name" */
  label?: string
  /** adds a prefix in front of the unit symbol to act as an identifier  */
  unitPrefix?: string
  /** Matches the display field to a db field. */
  // Could make this optional if not different than name, but it's easier to have a
  // guaranteed way to index Set when using the interface.
  source: keyof Set
  /** A set of rules for when to enable/disable showing the field.
   * If the key is undefined, the field is shown regardless of that key's value.
   * Otherwise, the field is only shown when the key equals the defined value.
   */
  enabled?: { [key in DisplayFieldGroups]?: boolean }
  /** Overrides the default column delimiter "/" */
  delimiter?: string
}

/** Valid keys for DisplayField.enabled groups.  */
type DisplayFieldGroups = 'splitWeight' | 'unilateral'

/** Prints the field's name (or label, if provided) followed by the appropriate units for that field, if applicable. */
export const printFieldWithUnits = (field: VisibleField, units: Units) =>
  `${field.label ?? capitalize(field.name)} ${
    units[field.source] === field.name
      ? ''
      : `(${field.unitPrefix ?? ''}${units[field.source]})`
  }`
