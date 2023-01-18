import { ApiHandler } from './util'
import withStatusHandler from './withStatusHandler'

export default function withApiMiddleware(handler: ApiHandler) {
  return withStatusHandler(handler)
}
