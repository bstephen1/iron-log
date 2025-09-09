/** Contains possible api query types for array fields. */
export enum ArrayMatchType {
  /** matches arrays that contain all the specified values, or more  */
  Partial = 'partial',
  /** matches arrays that contain all the specified values and no more */
  Exact = 'exact',
  Any = 'any',
}

/** builds a mongo Filter to query based on the desired ArrayMatchType. */
export function buildMatchTypeFilter(
  array: unknown[] | undefined,
  matchType: ArrayMatchType | undefined
) {
  // The array needs special handling if it's empty. $all and $in always return no documents for empty arrays.
  const isEmpty = !array?.length
  const sizeFilter = { $size: isEmpty ? 0 : array.length }
  const elementsFilter = { $all: array }

  switch (matchType) {
    case undefined:
      return undefined
    case ArrayMatchType.Partial:
      // for empty arrays, partial matching means match anything
      return isEmpty ? undefined : elementsFilter
    case ArrayMatchType.Exact:
      // Note: for exact matches, order of array elements doesn't matter.
      // This mongo query is potentially expensive. Alternatively, arrays could be sorted on insertion.
      // The latter provides for some pretty clunky ux when editing Autocomplete chips, so
      // we are opting for the former unless performance notably degrades.
      // See: https://stackoverflow.com/questions/29774032/mongodb-find-exact-array-match-but-order-doesnt-matter
      return isEmpty ? sizeFilter : { ...sizeFilter, ...elementsFilter }
    default:
      throw new Error(`unexpected match type: ${matchType}`)
  }
}
