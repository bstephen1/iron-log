import { noSwipingRecord } from './constants'
import useDesktopCheck from './useDesktopCheck'

/** Returns classname for no swiping if desktop is detected.
 *
 *  Some elements do not work correctly if a cursor is present and swiping is enabled.
 *  Eg, Selects will not open when clicked unless swiping is disabled.
 */
export default function useNoSwipingDesktop() {
  return useDesktopCheck() ? noSwipingRecord : ''
}
