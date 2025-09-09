import { z } from 'zod'
import { dateSchema } from './schemas'

export default interface DateRangeQuery {
  /** Limit the number of results. Treated as an absolute value (Negatives are the same as positives). 0 means no limit. */
  limit?: number
  /** YYYY-MM-DD */
  start?: string
  /** YYYY-MM-DD */
  end?: string
  /** defaults to "newestFirst" */
  sort?: 'oldestFirst' | 'newestFirst'
  /** YYYY-MM-DD. Use a specific date. Overrides start/end */
  date?: string
}

export const dateRangeQuerySchema = z
  .object({
    /** Limit the number of results. Treated as an absolute value (Negatives are the same as positives). 0 means no limit. */
    // coerce strings into numbers before zod processing
    limit: z.coerce.number().int(),
    /** start date */
    start: z.string().date(),
    /** end date */
    end: z.string().date(),
    sort: z.enum(['oldestFirst', 'newestFirst']),
    /** Use a specific date. Overrides start/end */
    // todo: remove this or have it set start/limit to the same value
    date: dateSchema,
  })
  .partial()
