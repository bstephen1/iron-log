import { z } from 'zod'
import { weighInTypes } from '../Bodyweight'
import { dateRangeQuerySchema } from './DateRangeQuery'

export interface BodyweightQuery
  extends z.infer<typeof bodyweightQuerySchema> {}
export const bodyweightQuerySchema = dateRangeQuerySchema
  .extend({
    type: z.enum(weighInTypes),
  })
  .partial()
