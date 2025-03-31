import { Filter } from 'mongodb'
import DateRangeQuery from './DateRangeQuery'
import { ApiError } from '../ApiError'
import { StatusCodes } from 'http-status-codes'
import isEqual from 'react-fast-compare'

// todo: rename to MatchTypes.ts

/** A query to send to mongo.  */
export interface MongoQuery<T> extends DateRangeQuery {
  filter?: Filter<T>
  /** Matches array fields corresponding to the given filter field with a schema for match type. */
  matchTypes?: MatchTypes<T>
}

/** An object that has keys corresponding to Partial\<T\> keys,
 * declaring the MatchTypes for a MongoQuery
 */
export type MatchTypes<T> = {
  [key in keyof Partial<T>]: MatchType
}

/** Contains possible api query types for array fields. */
export enum MatchType {
  /** matches arrays that contain all the specified values, or more  */
  Partial = 'partial',
  /** matches arrays that contain all the specified values and no more */
  Exact = 'exact',
  Any = 'any',
}

/** sets a Filter to query based on the desired MatchType schema.
 * Should only be called once on a given filter.
 *
 * If no matchTypes are provided, arrays will be matched as ArrayMatchType.Exact
 */
export function buildMatchTypeFilter(
  array: unknown[] | undefined,
  matchType: MatchType | undefined
) {
  // The array needs special handling if it's empty. $all and $in always return no documents for empty arrays.
  const isEmpty = !array?.length || isEqual(array, [''])
  const sizeFilter = { $size: isEmpty ? 0 : array.length }
  const elementsFilter = { $all: array }

  switch (matchType) {
    case undefined:
      return undefined
    case MatchType.Partial:
      // for empty arrays, partial matching means match anything
      return isEmpty ? undefined : elementsFilter
    case MatchType.Exact:
      // Note: for exact matches, order of array elements doesn't matter.
      // This mongo query is potentially expensive. Alternatively, arrays could be sorted on insertion.
      // The latter provides for some pretty clunky ux when editing Autocomplete chips, so
      // we are opting for the former unless performance notably degrades.
      // See: https://stackoverflow.com/questions/29774032/mongodb-find-exact-array-match-but-order-doesnt-matter
      return isEmpty ? sizeFilter : { ...sizeFilter, ...elementsFilter }
    default:
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `unexpected match type: ${matchType}`
      )
  }
}
