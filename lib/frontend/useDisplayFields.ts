import type { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import {
  DEFAULT_DISPLAY_FIELDS,
  DEFAULT_DISPLAY_FIELDS_SPLIT_WEIGHT,
} from '../../models/DisplayFields'

export default function useDisplayFields(exercise?: Exercise | null) {
  return (
    exercise?.displayFields ??
    (exercise?.attributes.bodyweight
      ? DEFAULT_DISPLAY_FIELDS_SPLIT_WEIGHT
      : DEFAULT_DISPLAY_FIELDS)
  )
}
