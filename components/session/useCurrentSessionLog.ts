import { useParams } from 'next/navigation'
import { useSessionLog } from '../../lib/frontend/restService'

/** Use within DateContext to retrieve session data and mutators.
 *  Session fields are spread out directly for convenient access.
 */
export default function useCurrentSessionLog() {
  // useParams can accept generic type but still claims it may be null (it cannot)
  // for page router compat
  const { date } = useParams() as { date: string }
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
