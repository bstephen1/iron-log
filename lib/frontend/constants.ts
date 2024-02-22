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

//------
// URIS
//------

export const URI_SESSIONS = '/api/sessions/'
export const URI_EXERCISES = '/api/exercises/'
export const URI_MODIFIERS = '/api/modifiers/'
export const URI_CATEGORIES = '/api/categories/'
export const URI_RECORDS = '/api/records/'
export const URI_BODYWEIGHT = '/api/bodyweight-history/'
