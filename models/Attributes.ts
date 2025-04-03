import { z } from 'zod'

/** An exercise may have a number of attributes. Attributes are permanent features
 * of an exercise which change how it is treated.
 */
export interface Attributes extends z.infer<typeof attributesSchema> {}

export const attributesSchema = z.object({
  /** An exercise that includes bodyweight as a part of total weight lifted. */
  bodyweight: z.boolean().optional(),
  /** An exercise that is split into left and right sides which can be recorded separately. */
  unilateral: z.boolean().optional(),
})
