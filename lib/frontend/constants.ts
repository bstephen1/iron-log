import { OutlinedSelectProps, SxProps } from '@mui/material'
import { CSSProperties } from '@mui/material/styles/createMixins'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const validDateStringRegex = /^\d{4}-\d{2}-\d{2}$/
export const TIME_FORMAT = 'HH:mm:ss'

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
export const guestUserName = 'guest'
export const sampleLogDate = '2022-09-26'

export const userGuideLink = 'https://github.com/bstephen1/iron-log/wiki'
/** globals.css overrides <a> style so internal links are not treating as standard
 *  href links. This style overrides the global to show links in the standard default style.
 */
export const standardLinkStyle: CSSProperties = {
  color: '-webkit-link',
  textDecoration: 'underline',
}

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
 *  Note: for ts type, we are just picking the relevant fields so as not to mess up the actual
 *  Select's typing. An update to package.json changed the typing information so we must use OutlinedSelectProps.
 */
export const fixSelectBackground: Pick<
  OutlinedSelectProps,
  'variant' | 'notched'
> = {
  variant: 'outlined',
  notched: undefined,
}

/**
 * Styles input labels for Selects to span the whole width of the component,
 * instead of just the text length. This helps make standard variants more consistent
 * with autocompletes, where clicking this aread will focus the component.
 */
export const fullWidthSelectLabelSx: SxProps = {
  // A quirk of mui styling means the width must be 133%, not 100%.
  width: '133%',
  cursor: 'pointer',
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
