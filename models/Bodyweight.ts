import dayjs from 'dayjs'
import { z } from 'zod'
import { DATE_FORMAT } from '../lib/frontend/constants'
import { generateId } from '../lib/util'
import type DateRangeQuery from './DateRangeQuery'
import { dateSchema, idSchema } from './schemas'

/** A weigh-in can be one of two types:
 * - Official: Used for tracking bodyweight over time. Ideally measured at the same time of day under similar conditions.
 * - Unofficial: Used for weigh-ins that include extraneous factors that differentiate them from official weigh-ins.
 * The intended use case is to measure weight lifted for bodyweight exercises at the gym.
 */
// See: https://steveholgado.com/typescript-types-from-arrays/
export type WeighInType = (typeof weighInTypes)[number]
export const weighInTypes = ['official', 'unofficial'] as const

// we extend an empty interface so intellisense just infers it as "Bodyweight"
// instead of listing all the properties of the schema
export interface Bodyweight extends z.infer<typeof bodyweightSchema> {}

export const bodyweightSchema = z.object({
  _id: idSchema,
  value: z.number(),
  type: z.enum(weighInTypes),
  /** YYYY-MM-DD */
  date: dateSchema,
})

export const createBodyweight = (
  value: number,
  type: WeighInType,
  /** a dayjs() date object that will be formatted internally.
   * This avoids the possibility of being passed an incorrectly
   * formatted date string. */
  dayjsDate = dayjs()
): Bodyweight => ({
  _id: generateId(),
  value,
  type,
  date: dayjsDate.format(DATE_FORMAT),
})

export type BodyweightRangeQuery = BodyweightQuery & DateRangeQuery
export interface BodyweightQuery
  extends z.infer<typeof bodyweightQuerySchema> {}
export const bodyweightQuerySchema = z
  .object({
    type: z.enum(weighInTypes),
  })
  .partial()
