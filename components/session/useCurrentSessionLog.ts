import { useGuaranteedSessionLog } from 'lib/frontend/restService'
import { useSessionLogContext } from './SessionLogContext'

/** Use within SessionLogContext to retrieve record data and mutators.
 *  Session fields are spread out directly for convenient access.
 */
export default function useCurrentSessionLog() {
  const context = useSessionLogContext()
  const { sessionLog, mutate } = useGuaranteedSessionLog(
    context.date,
    context.sessionLog
  )

  return {
    sessionLog,
    mutate,
    ...sessionLog,
    // date is always defined, even for null sessions
    date: context.date,
  }
}
