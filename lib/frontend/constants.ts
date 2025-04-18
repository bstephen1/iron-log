import { CSSProperties } from '@mui/material/styles/createMixins'

export const DATE_FORMAT = 'YYYY-MM-DD'
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

/** error messages returned from the api  */
export const ERRORS = {
  validationFail: 'invalid request',
  default: 'error could not be parsed',
  retry: 'Something went wrong. Please retry.',
}

//------
// URIS
//------

export const URI_SESSIONS = '/api/sessions/'
export const URI_EXERCISES = '/api/exercises/'
export const URI_MODIFIERS = '/api/modifiers/'
export const URI_CATEGORIES = '/api/categories/'
export const URI_RECORDS = '/api/records/'
export const URI_BODYWEIGHT = '/api/bodyweights/'
