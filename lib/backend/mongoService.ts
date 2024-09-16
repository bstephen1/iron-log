import { StatusCodes } from 'http-status-codes'
import { Document, Filter, ObjectId } from 'mongodb'
import { ApiError } from 'next/dist/server/api-utils'
import Category from '../../models/AsyncSelectorOption/Category'
import Exercise from '../../models/AsyncSelectorOption/Exercise'
import Modifier from '../../models/AsyncSelectorOption/Modifier'
import Bodyweight from '../../models/Bodyweight'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import {
  MatchType,
  MatchTypes,
  MongoQuery,
} from '../../models/query-filters/MongoQuery'
import { collections } from './mongoConnect'
const {
  sessions,
  exercises,
  modifiers,
  categories,
  records,
  bodyweightHistory,
} = collections

interface UpdateFieldsProps<T extends { _id: string }> {
  id: T['_id']
  updates: Partial<T>
}

const convertSort = (sort: DateRangeQuery['sort']) =>
  sort === 'oldestFirst' ? 1 : -1

// todo: add a guard to not do anything if calling multiple times
/** sets a Filter to query based on the desired MatchType schema.
 * Should only be called once on a given filter.
 *
 * If no matchTypes are provided, arrays will be matched as ArrayMatchType.Exact
 */
function setArrayMatchTypes<T>(filter?: Filter<T>, matchTypes?: MatchTypes<T>) {
  if (!filter) {
    return
  }

  for (const key in matchTypes) {
    // set type cannot be handled as an array
    if (key === 'setType') {
      continue
    }
    // The array needs special handling if it's empty. $all and $in always return no documents for empty arrays.
    const array = filter[key]
    const isEmpty = !array.length
    switch (matchTypes[key]) {
      case MatchType.Partial:
        // typescript complaining for some reason. May or may not be a better way to silence it.
        filter[key] = { $all: array } as any

        // for empty arrays, matching any means match anything
        isEmpty && delete filter[key]
        break
      case MatchType.Exact:
      default:
        // Note: for standard exact matches, order of array elements matters.
        // It is possible, but potentially expensive to query for an exact match where order
        // doesn't matter (ie, the "equivalent" matchType). Alternatively, arrays should be sorted on insertion.
        // The latter provides for some pretty clunky ux when editing Autocomplete chips, so
        // we are opting for the former unless performance notably degrades.
        // See: https://stackoverflow.com/questions/29774032/mongodb-find-exact-array-match-but-order-doesnt-matter
        filter[key] = { $size: array.length } as any
        // If matching empty array, can't use $all. It always returns no documents when given an empty array.
        if (!isEmpty) {
          filter[key]['$all'] = array
        }
        break
    }
  }
}

// Note on ObjectId vs UserId -- the api uses UserId for types instead of ObjectId.
// This is to make the api less tightly coupled to mongo, in case the db changes down the line.
// Here ObjectId is used instead because this is the service that interfaces with mongo.

//---------
// SESSION
//---------

export async function addSession(
  userId: ObjectId,
  sessionLog: SessionLog,
): Promise<SessionLog> {
  await sessions.insertOne({ ...sessionLog, userId })
  return sessionLog
}

export async function fetchSession(
  userId: ObjectId,
  date: string,
): Promise<SessionLog | null> {
  return await sessions.findOne({ userId, date }, { projection: { userId: 0 } })
}

/** The default start/end values compare against the first char of the date (ie, the first digit of the year).
 *  So '0' is equivalent to year 0000 and '9' is equivalent to year 9999
 */
export async function fetchSessions({
  userId,
  limit,
  start = '0',
  end = '9',
  sort = 'newestFirst',
}: MongoQuery<SessionLog>): Promise<SessionLog[]> {
  return await sessions
    .find(
      { userId, date: { $gte: start, $lte: end } },
      { projection: { userId: 0 } },
    )
    .sort({ date: convertSort(sort) })
    .limit(limit || Number.MAX_SAFE_INTEGER)
    .toArray()
}

export async function updateSession(
  userId: ObjectId,
  sessionLog: SessionLog,
): Promise<SessionLog | null> {
  return await sessions.findOneAndReplace(
    { userId, date: sessionLog.date },
    { ...sessionLog, userId },
    {
      upsert: true,
      projection: { userId: 0 },
      returnDocument: 'after',
    },
  )
}

// todo: make this a transaction?
export async function deleteSessionRecord(
  userId: ObjectId,
  date: string,
  recordId: string,
): Promise<SessionLog | null> {
  await deleteRecord(userId, recordId)
  return await sessions.findOneAndUpdate(
    { userId, date },
    // $pull is equivalent to removing an element from an array
    { $pull: { records: recordId } },
    {
      projection: { userId: 0 },
      returnDocument: 'after',
    },
  )
}

// todo: fetch sessions in date range

//--------
// RECORD
//--------

interface RecordPipeline {
  // Unwind returns a record for every item in the array (we only have one or zero items).
  /** $lookup the exercise based on the exercise _id to ensure we have the current data.
   * This returns an array so we need to unwind it. */
  lookupExercise: Document
  /** $unwind the exercise array returned by $lookup. This produces a new document for every
   *  element in the array. Eeach record can only have zero or one exercise.
   *  We must enable preserveNullAndEmptyArrays or records without an exercise would just
   *  be returned as "null".
   */
  unwindExercise: Document
  /** $set activeModifiers to only contain elements that exist in exercise.modifiers.
   *  This addresses if the user removes a modifier from an exercise --
   *  the modifier should no longer appear in records. We maintain the data though,
   *  in case the user re-adds the modifier in the future. This stage should be invoked
   *  after $unwinding the exercise.
   */
  setActiveModifiers: Document
  /** $project to exclude userId in the record and exercise */
  excludeUserIds: Document
}
/** Shared aggregation stages for record fetches. */
const recordPipeline: RecordPipeline = {
  lookupExercise: {
    $lookup: {
      from: 'exercises',
      localField: 'exercise._id',
      foreignField: '_id',
      as: 'exercise',
    },
  },
  unwindExercise: {
    $unwind: { path: '$exercise', preserveNullAndEmptyArrays: true },
  },
  setActiveModifiers: {
    $set: {
      activeModifiers: {
        $filter: {
          input: '$activeModifiers',
          as: 'modifier',
          cond: { $in: ['$$modifier', '$exercise.modifiers'] },
        },
      },
    },
  },
  excludeUserIds: { $project: { userId: 0, 'exercise.userId': 0 } },
}

export async function addRecord(
  userId: ObjectId,
  record: Record,
): Promise<Record> {
  await records.insertOne({ ...record, userId })
  return record
}

// todo: pagination
export async function fetchRecords({
  filter = {},
  limit,
  start = '0',
  end = '9',
  userId,
  sort = 'newestFirst',
  matchTypes,
}: MongoQuery<Record>): Promise<Record[]> {
  setArrayMatchTypes(filter, matchTypes)

  // Records do not store up-to-date exercise data; they pull in updated data on fetch.
  // So for this query anything within the "exercise" object must be
  // matched AFTER the exercises $lookup.
  // For better efficiency we can split the filter into pre and post $lookup matches.
  // We put as much as possible in pre-lookup to reduce the amount of exercise lookup
  // (instead of looking up the exercise for every record first before starting to filter),
  // and only put the filters that depend on current exercise data into post-lookup.
  const { 'exercise.name': name, ...otherFilters } = filter

  return await records
    .aggregate<Record>([
      // date range will be overwritten if a specific date is given in the filter
      {
        $match: { date: { $gte: start, $lte: end }, ...otherFilters, userId },
      },
      recordPipeline.lookupExercise,
      {
        $match: name ? { 'exercise.name': name } : {},
      },
      recordPipeline.unwindExercise,
      recordPipeline.setActiveModifiers,
      recordPipeline.excludeUserIds,
    ])
    .sort({ date: convertSort(sort) })
    // Mongo docs say passing limit of 0 is equivalent to no limit,
    // but that actually results in an error saying limit must be a positive 64 bit int.
    .limit(limit || Number.MAX_SAFE_INTEGER)
    // find() returns a cursor, so it has to be converted to an array
    .toArray()
}

// todo: update record if exercise has been modified since last fetch
export async function fetchRecord(
  userId: ObjectId,
  _id: Record['_id'],
): Promise<Record | null> {
  return await records
    .aggregate<Record>([
      { $match: { userId, _id } },

      recordPipeline.lookupExercise,

      recordPipeline.unwindExercise,

      recordPipeline.setActiveModifiers,
      recordPipeline.excludeUserIds,
    ])
    // return just the first (there's only the one)
    .next()
}

export async function updateRecord(
  userId: ObjectId,
  record: Record,
): Promise<Record | null> {
  await records.replaceOne(
    { userId, _id: record._id },
    { ...record, userId },
    {
      upsert: true,
    },
  )

  // When updating record, we have to make sure the exercise data is up to date.
  // Previously mongo functions returned null, so this was done with a separate GET
  // from the client.
  // Now, mongo functions are responsible for returning up to date data.
  return await fetchRecord(userId, record._id)
}

export async function updateRecordFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Record>,
): Promise<Record | null> {
  await records.updateOne({ userId, _id: id }, { $set: updates })
  return await fetchRecord(userId, id)
}

// Currently not exporting. To delete call deleteSessionRecord().
// All Records must belong to a Session, so a record can only be deleted in the context of a Session.
async function deleteRecord(userId: ObjectId, _id: string) {
  return await records.deleteOne({ userId, _id })
}

//----------
// EXERCISE
//----------

export async function addExercise(
  userId: ObjectId,
  exercise: Exercise,
): Promise<Exercise> {
  await exercises.insertOne({ ...exercise, userId })
  return exercise
}

/** This fetch supports the array field "categories". By default, a query on categories
 * will match records that contain any one of the given categories array.
 */
export async function fetchExercises({
  userId,
  filter,
  matchTypes,
}: MongoQuery<Exercise>): Promise<Exercise[]> {
  setArrayMatchTypes(filter, matchTypes)

  return await exercises
    .find({ ...filter, userId }, { projection: { userId: 0 } })
    .toArray()
}

export async function fetchExercise(
  userId: ObjectId,
  _id: string,
): Promise<Exercise | null> {
  return await exercises.findOne({ userId, _id }, { projection: { userId: 0 } })
}

// todo: add guard to anything with Status such that Status.new cannot be saved to db.
export async function updateExercise(
  userId: ObjectId,
  exercise: Exercise,
): Promise<Exercise | null> {
  return await exercises.findOneAndReplace(
    { userId, _id: exercise._id },
    { ...exercise, userId },
    {
      upsert: true,
      returnDocument: 'after',
      projection: { userId: 0 },
    },
  )
}

export async function updateExerciseFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Exercise>,
): Promise<Exercise | null> {
  return await exercises.findOneAndUpdate(
    { userId, _id: id },
    { $set: updates },
    {
      returnDocument: 'after',
      projection: { userId: 0 },
    },
  )
}

export async function deleteExercise(userId: ObjectId, name: string) {
  const exercise = await exercises.find({ userId, name }).next()
  // cannot use the name because the full exercise is not guaranteed to be up to date
  const usedRecords = await records
    .find({ userId, 'exercise._id': exercise?._id })
    .toArray()

  if (usedRecords.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot delete exercise: used in one or more records: ${usedRecords.map((record) => record.date + ', ')}`,
    )
  }

  await exercises.deleteOne({ userId, name })
  return name
}

//----------
// MODIFIER
//----------

export async function addModifier(
  userId: ObjectId,
  modifier: Modifier,
): Promise<Modifier> {
  await modifiers.insertOne({ ...modifier, userId })
  return modifier
}

export async function fetchModifiers({
  filter,
  userId,
}: MongoQuery<Modifier>): Promise<Modifier[]> {
  return await modifiers
    .find({ ...filter, userId }, { projection: { userId: 0 } })
    .toArray()
}

export async function fetchModifier(
  userId: ObjectId,
  name: string,
): Promise<Modifier | null> {
  return await modifiers.findOne(
    { userId, name },
    { projection: { userId: 0, _id: 0 } },
  )
}

export async function updateModifierFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Modifier>,
): Promise<Modifier | null> {
  if (updates.name) {
    const oldModifier = await modifiers.find({ userId, _id: id }).next()
    await exercises.updateMany(
      { userId, modifiers: oldModifier?.name },
      { $set: { 'modifiers.$': updates.name } },
    )
    // nested $[] operator (cannot use simple $ operator more than once): https://jira.mongodb.org/browse/SERVER-831
    // typescript isn't recognizing notes.$[].tags.$[tag] as a valid signature for $set even though it works and is the recommended way to do it
    await exercises.updateMany(
      { userId, 'notes.tags': oldModifier?.name },
      { $set: { 'notes.$[].tags.$[tag]': updates.name } as any },
      { arrayFilters: [{ tag: oldModifier?.name }] },
    )
    await records.updateMany(
      { userId, category: oldModifier?.name },
      { $set: { category: updates.name } },
    )
    await records.updateMany(
      { userId, activeModifiers: oldModifier?.name },
      { $set: { 'activeModifiers.$': updates.name } },
    )
  }
  return await modifiers.findOneAndUpdate(
    { userId, _id: id },
    { $set: updates },
    {
      projection: { userId: 0 },
      returnDocument: 'after',
    },
  )
}

export async function deleteModifier(userId: ObjectId, name: string) {
  const userExercises = await exercises.find({ userId }).toArray()
  const usedExercise = userExercises.find((exercise) =>
    exercise.modifiers.includes(name),
  )

  if (usedExercise) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot delete modifier: used in exercise "${usedExercise.name}"`,
    )
  }

  await modifiers.deleteOne({ userId, name })
  return name
}

//----------
// CATEGORY
//----------

export async function addCategory(
  userId: ObjectId,
  category: Category,
): Promise<Category> {
  await categories.insertOne({ ...category, userId })
  return category
}

export async function fetchCategories(
  filter?: Filter<Category>,
): Promise<Category[]> {
  return await categories
    .find({ ...filter }, { projection: { userId: 0 } })
    .toArray()
}

export async function fetchCategory(
  userId: ObjectId,
  name: string,
): Promise<Category | null> {
  return await categories.findOne(
    { userId, name },
    { projection: { userId: 0, _id: 0 } },
  )
}

export async function updateCategoryFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Category>,
): Promise<Category | null> {
  // todo: should this be a transaction? Apparently that requires a cluster
  // can run single testing node as cluster with mongod --replset rs0
  if (updates.name) {
    const oldCategory = await categories.find({ userId, _id: id }).next()
    await exercises.updateMany(
      { userId, categories: oldCategory?.name },
      { $set: { 'categories.$': updates.name } },
    )
    await records.updateMany(
      { userId, category: oldCategory?.name },
      { $set: { category: updates.name } },
    )
  }
  return await categories.findOneAndUpdate(
    { userId, _id: id },
    { $set: updates },
    {
      projection: { userId: 0 },
      returnDocument: 'after',
    },
  )
}

export async function deleteCategory(userId: ObjectId, name: string) {
  const userExercises = await exercises.find({ userId }).toArray()
  const usedExercise = userExercises.find((exercise) =>
    exercise.categories.includes(name),
  )

  if (usedExercise) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot delete category: used in exercise "${usedExercise.name}"`,
    )
  }

  await categories.deleteOne({ userId, name })
  return name
}

//------------
// BODYWEIGHT
//------------

export async function addBodyweight(
  userId: ObjectId,
  bodyweight: Bodyweight,
): Promise<Bodyweight> {
  await bodyweightHistory.insertOne({ ...bodyweight, userId })
  return bodyweight
}

/** The default start/end values compare against the first char of the date (ie, the first digit of the year).
 *  So '0' is equivalent to year 0000 and '9' is equivalent to year 9999
 */
export async function fetchBodyweightHistory({
  userId,
  limit,
  start = '0',
  end = '9',
  filter,
  sort,
}: MongoQuery<Bodyweight>): Promise<Bodyweight[]> {
  return await bodyweightHistory
    .find(
      { userId, date: { $gte: start, $lte: end }, ...filter },
      { projection: { userId: 0, _id: 0 } },
    )
    .sort({ date: convertSort(sort) })
    .limit(limit || Number.MAX_SAFE_INTEGER)
    .toArray()
}

/** If updating at the same date, it will overwrite. This allows for updating an existing bodyweight
 * instead of always making a new one.
 *
 * Note: two records can exist on the same date if they are different types.
 */
export async function updateBodyweight(
  userId: ObjectId,
  newBodyweight: Bodyweight,
): Promise<Bodyweight | null> {
  return await bodyweightHistory.findOneAndUpdate(
    { userId, date: newBodyweight.date, type: newBodyweight.type },
    // Can't just update the doc because the new one will have a new _id.
    // setOnInsert only activates if upserting. The upsert inserts a new doc built from
    // the find query plus the update fields (so all fields have to be manually spelled out).
    // There might be a way to replace the whole doc, but would have to move the _id to setOnInsert.
    {
      $set: { value: newBodyweight.value },
      $setOnInsert: { _id: newBodyweight._id },
    },
    {
      upsert: true,
      projection: { userId: 0 },
      returnDocument: 'after',
    },
  )
}

// todo: use id, not date. Not currently in use.
export async function deleteBodyweight(userId: ObjectId, date: string) {
  return await bodyweightHistory.deleteOne({ userId, date })
}
