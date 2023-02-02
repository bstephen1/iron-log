/** Contains possible query types for arrays.  */
export enum ArrayMatchType {
  /** matches records with any one of the provided values */
  Any = 'any',
  /** matches records with all of the provided values (but may have more) */
  All = 'all',
  /** matches records that only contain the provided values (but may not have all of them).
   * This option does not include records with a null or empty array
   */
  Only = 'only',
  /** matches records that only contain the provided values (but may not have all of them).
   * This option includes records with a null or empty array
   */
  OnlyWithNull = 'onlyWithNull',
  /** matches records that contain exactly the provided values list (combines All and Only) */
  Exact = 'exact',
}
