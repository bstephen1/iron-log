import { useDateContext } from '../../app/sessions/[date]/SessionPage'
import { useSessionLog } from '../../lib/frontend/restService'

/** Use within DateContext to retrieve session data and mutators.
 *  Session fields are spread out directly for convenient access.
 */
export default function useCurrentSessionLog() {
  const date = useDateContext()
  const { sessionLog, mutate } = useSessionLog(date)

  return {
    sessionLog,
    mutate,
    ...sessionLog,
    // Make sure sessionLog spread doesn't overwrite date.
    // Data would be the same, but would allow undefined types
    date,
  }
}
