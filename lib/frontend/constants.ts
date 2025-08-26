export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_PICKER_FORMAT = 'MM/DD/YY'
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

/** error messages returned from the api  */
export const ERRORS = {
  validationFail: 'invalid request',
  default: 'error could not be parsed',
  retry: 'Something went wrong. Please retry.',
}

export enum QUERY_KEYS {
  categories = 'categories',
  modifiers = 'modifiers',
  exercises = 'exercises',
}

//------
// URIS
//------

export const URI_SESSIONS = '/api/sessions/'
export const URI_RECORDS = '/api/records/'
export const URI_BODYWEIGHT = '/api/bodyweights/'
