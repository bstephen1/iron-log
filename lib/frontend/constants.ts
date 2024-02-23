import { SelectProps } from '@mui/material'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const validDateStringRegex = /^\d{4}-\d{2}-\d{2}$/

// Was thinking of making this a user pref, but may not be necessary.
// The value is already fuzzy if weighing with clothes, and if you knew the exact weight
// you could just input the that instead.
export const DEFAULT_CLOTHING_OFFSET = 1

/** className to disable swiping for record card swiper.
 *  Must be given as a prop to the Swiper.
 *  Note: Swiper automatically disables swiping on inputs and buttons,
 *  but not on comboboxes. They must have swiping disabled or swiper will
 *  intercept all clicks trying to open them, thinking you're trying to swipe.
 */
export const noSwipingRecord = 'swiper-no-swiping-record'

export const devUserId = '123456789012345678901234'

/** This is a visual fix for Selects and Textfields set as "select" that should be spread into SelectProps.
 *
 *  Using standard variant causes the input background to have a gray shadow after selecting something.
 *  This behavior is apparently completely undocumented and uneditable.
 *  This prevents that, keeping the background transparent.
 *
 *  Note: changing variant in SelectProps has no visual effect; the visible variant is determined by the variant in TextFieldProps
 *  (which gets passed as the variant to the inner Select).
 *  Providing an "input" completely overrides any visual effect the variant would have on a basic Select.
 *
 *  Note: An update to mui started causing this to trigger console errors. Now when the select is
 *  set to outlined and displayEmpty is active, this "notched" prop gets set to true. Notched is
 *  only defined for outlined inputs so since the input is not actually outlined it causes an
 *  error for assigning a boolean to an expected undefined value.
 *  See: https://github.com/mui/material-ui/pull/40865
 *
 *  Note: for typing, we are just picking the relevant fields so as not to mess up the actual
 *  Select's typing.
 */
export const fixSelectBackground: Pick<SelectProps, 'variant' | 'notched'> = {
  variant: 'outlined',
  notched: undefined,
}

//------
// URIS
//------

export const URI_SESSIONS = '/api/sessions/'
export const URI_EXERCISES = '/api/exercises/'
export const URI_MODIFIERS = '/api/modifiers/'
export const URI_CATEGORIES = '/api/categories/'
export const URI_RECORDS = '/api/records/'
export const URI_BODYWEIGHT = '/api/bodyweight-history/'
