/** An exercise may have a number of attributes. Attributes are permanent features
 * of an exercise which change how it is treated.
 */
export default interface Attributes {
  /** An exercise that includes bodyweight as a part of total weight lifted. */
  bodyweight?: boolean
  /** An exercise that is split into left and right sides which can be recorded separately. */
  unilateral?: boolean
}
