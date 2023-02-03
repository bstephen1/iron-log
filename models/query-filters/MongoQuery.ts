import {
  Condition,
  Join,
  NestedPaths,
  ObjectId,
  PropertyType,
  RootFilterOperators,
} from 'mongodb'

/** A query to send to mongo.  */
export interface MongoQuery<T> {
  filter?: MongoFilter<T>
  /** limit the number of results */
  limit?: number
  /** start date */
  start?: string
  /** end date */
  end?: string
  /** Matches array fields corresponding to the given filter field with a schema for match type. */
  matchTypes?: MatchTypes<T>
  /** Required. Split out from the filter since the filter is optional. */
  userId: ObjectId
}

/** An object that has keys corresponding to Partial\<T\> keys,
 * declaring the ArrayMatchTypes for a MongoQuery
 */
export type MatchTypes<T> = {
  [key in keyof Partial<T>]: ArrayMatchType
}

/** Contains possible query types for arrays.  */
export enum ArrayMatchType {
  /** matches records with any one of the provided values */
  Any = 'any',
  /** matches records with all of the provided values (but may have more) */
  All = 'all',
  /** matches records that only contain the provided values (but may not have all of them).
   * This option does not include records with a null or empty array
   */
  // Only = 'only',
  /** matches records that only contain the provided values (but may not have all of them).
   * This option includes records with a null or empty array
   */
  // OnlyWithNull = 'onlyWithNull',
  /** matches records that contain exactly the provided values list (combines All and Only) */
  Exact = 'exact',
}

// It was REALLY finnicky to get mongo dot notations working with typescript.
// There are two key things required for it to work right:
// - DO NOT USE "AS"! The first line below will work, the second will not!
//    const filter: Filter<TSchema> = {}
//    const filter = {} as Filter<TSchema>
// - The initial object must include something NOT in the generic Filter type.
// Filter is actually a union type that includes Partial<TSchema>. If you pass an
// empty object in, typescript will not know if the object is supposed to be just a
// TSchema or the longer half of the union which includes nested accessors.
// So it will default to an object which contains only the shared
// fields, which ends up just being Partial<TSchema> since it's a subset of the other.
// By including something not in TSchema, we let typescript know that the object
// is not of that restricted type.
//
// So instead of using the actual mongo Filter object, we've pulled out the
// part that we want and made a custom type. With the custom filter "as" works fine
// and there's no union to worry about. The custom filter also removes the WithId<>
// wrapper because the models already include _id fields.
//
// Originally left out RootFilterOperators, but that turned out to be needed to
// query nested arrays (eg, filter['sets.reps'] for Records).

/** A restricted mongo Filter thatremoves mongo Filter's Partial\<TSchema\> union type,
 * which doesn't play nice with typescript. This means this type can't be used to query for
 * an exact given document. If that is a desired query it should
 * be passed to the mongo service typed as a Partial\<TSchema\> instead.
 */
export type MongoFilter<TSchema> = {
  [Property in Join<NestedPaths<TSchema>, '.'>]?: Condition<
    PropertyType<TSchema, Property>
  >
} & RootFilterOperators<TSchema>
