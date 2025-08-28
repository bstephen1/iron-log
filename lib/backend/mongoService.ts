'use server'
import { StatusCodes } from 'http-status-codes'
import { type Document, type Filter, type ObjectId } from 'mongodb'
import type DateRangeQuery from '../../models//DateRangeQuery'
import { ApiError } from '../../models/ApiError'
import { type Category } from '../../models/AsyncSelectorOption/Category'
import { type Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { type Modifier } from '../../models/AsyncSelectorOption/Modifier'
import { type Bodyweight } from '../../models/Bodyweight'
import { type Record } from '../../models/Record'
import { createSessionLog, type SessionLog } from '../../models/SessionLog'
import { getUserId } from './auth'
import { collections } from './mongoConnect'
const {
  sessions,
  exercises,
  modifiers,
  categories,
  records,
  bodyweightHistory,
} = collections

const convertSort = (sort: DateRangeQuery['sort']) =>
  sort === 'oldestFirst' ? 1 : -1

// Note on ObjectId vs UserId -- the api uses UserId for types instead of ObjectId.
// This is to make the api less tightly coupled to mongo, in case the db changes down the line.
// Here ObjectId is used instead because this is the service that interfaces with mongo.

//---------
// SESSION
//---------

export async function fetchSessionLog(
  tmpId: ObjectId | undefined = undefined,
  date: string
): Promise<SessionLog | null> {
  const userId = tmpId ?? (await getUserId())
  return await sessions.findOne({ userId, date }, { projection: { userId: 0 } })
}

/** The default start/end values compare against the first char of the date (ie, the first digit of the year).
 *  So '0' is equivalent to year 0000 and '9' is equivalent to year 9999
 */
export async function fetchSessionLogs(
  tmpId: ObjectId | undefined = undefined,
  { limit, start = '0', end = '9', sort = 'newestFirst', date }: DateRangeQuery
): Promise<SessionLog[]> {
  const userId = tmpId ?? (await getUserId())
  return await sessions
    .find(
      { userId, date: date ?? { $gte: start, $lte: end } },
      { projection: { userId: 0 } }
    )
    .sort({ date: convertSort(sort) })
    .limit(limit || Number.MAX_SAFE_INTEGER)
    .toArray()
}

export async function upsertSessionLog(
  // ignore the id so we don't accidentally try to update it
  { _id, ...sessionLog }: SessionLog
): Promise<SessionLog | null> {
  const userId = await getUserId()
  return await sessions.findOneAndReplace(
    { userId, date: sessionLog.date },
    { ...sessionLog, userId },
    {
      upsert: true,
      projection: { userId: 0 },
      returnDocument: 'after',
    }
  )
}

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

export async function addRecord(record: Record): Promise<Record> {
  const userId = await getUserId()
  await records.insertOne({ ...record, userId })

  // add the record to its session (or create new session if needed)
  const { records: _unused, ...newSession } = createSessionLog(record.date)
  await sessions.updateOne(
    {
      userId,
      date: record.date,
    },
    // can't include records in $setOnInsert since that is getting updated in $push.
    // $push handles an undefined field like an empty array
    { $push: { records: record._id }, $setOnInsert: newSession },
    { upsert: true }
  )
  return record
}

export async function fetchRecords(
  tmpId: ObjectId | undefined,
  filter: Filter<Record> = {},
  { limit, start = '0', end = '9', sort = 'newestFirst', date }: DateRangeQuery
): Promise<Record[]> {
  // Records do not store up-to-date exercise data; they pull in updated data on fetch.
  // So for this query anything within the "exercise" object must be
  // matched AFTER the exercises $lookup.
  // For better efficiency we can split the filter into pre and post $lookup matches.
  // We put as much as possible in pre-lookup to reduce the amount of exercise lookup
  // (instead of looking up the exercise for every record first before starting to filter),
  // and only put the filters that depend on current exercise data into post-lookup.
  const { 'exercise.name': name, activeModifiers, ...otherFilters } = filter
  const userId = tmpId ?? (await getUserId())

  return await records
    .aggregate<Record>([
      {
        $match: {
          date: date ?? { $gte: start, $lte: end },
          ...otherFilters,
          userId,
        },
      },
      recordPipeline.lookupExercise,
      {
        $match: name ? { 'exercise.name': name } : {},
      },
      recordPipeline.unwindExercise,
      recordPipeline.setActiveModifiers,
      // have to match modifiers after we set the corrected activeModifiers
      { $match: activeModifiers ? { activeModifiers } : {} },
      recordPipeline.excludeUserIds,
    ])
    .sort({ date: convertSort(sort) })
    // Mongo docs say passing limit of 0 is equivalent to no limit,
    // but that actually results in an error saying limit must be a positive 64 bit int.
    .limit(limit || Number.MAX_SAFE_INTEGER)
    // find() returns a cursor, so it has to be converted to an array
    .toArray()
}

export async function fetchRecord(
  userId: ObjectId,
  _id: Record['_id']
): Promise<Record | null> {
  const record = await records
    .aggregate<Record>([
      { $match: { userId, _id } },

      recordPipeline.lookupExercise,

      recordPipeline.unwindExercise,

      recordPipeline.setActiveModifiers,
      recordPipeline.excludeUserIds,
    ])
    // return just the first (there's only the one)
    .next()

  // if we queried an id that doesn't exist, make sure it isn't
  // in any sessions
  if (!record) {
    sessions.updateMany({ userId }, { $pull: { records: _id } })
  }

  return record
}

export async function updateRecordFields(
  _id: string,
  updates: Partial<Record>
): Promise<Record> {
  const userId = await getUserId()
  return (await records.findOneAndUpdate(
    { userId, _id },
    { $set: updates },
    { returnDocument: 'after' }
  )) as Record
}

export async function deleteRecord(_id: string): Promise<string> {
  const userId = await getUserId()
  const record = await records.findOneAndDelete({ userId, _id })
  // remove the record from its associated session
  await sessions.updateOne(
    { userId, date: record?.date },
    // $pull is equivalent to removing an element from an array
    { $pull: { records: _id } }
  )

  return _id
}

//----------
// EXERCISE
//----------

export async function addExercise(exercise: Exercise): Promise<Exercise> {
  const userId = await getUserId()
  await exercises.insertOne({ ...exercise, userId })
  return exercise
}

export async function fetchExercises(): Promise<Exercise[]> {
  const userId = await getUserId()
  return await exercises
    .find({ userId }, { projection: { userId: 0 } })
    .toArray()
}

export async function fetchExercise(
  tmpId: ObjectId | undefined = undefined,
  _id: string
): Promise<Exercise | null> {
  const userId = tmpId ?? (await getUserId())
  return await exercises.findOne({ userId, _id }, { projection: { userId: 0 } })
}

export async function updateExerciseFields(
  _id: string,
  updates: Partial<Exercise>
): Promise<Exercise> {
  const userId = await getUserId()
  return (await exercises.findOneAndUpdate(
    { userId, _id },
    { $set: updates },
    {
      returnDocument: 'after',
      projection: { userId: 0 },
    }
  )) as Exercise
}

export async function deleteExercise(_id: string) {
  const userId = await getUserId()
  const exercise = await exercises.find({ userId, _id }).next()
  // note that the content of exercises in records is not guaranteed
  // to be up to date, but the exercise _id WILL be.
  const usedRecords = await records
    .find({ userId, 'exercise._id': exercise?._id })
    .toArray()

  if (usedRecords.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Cannot delete exercise: used in one or more records on the following dates: ${usedRecords.map(({ date }) => date).join(', ')}`
    )
  }

  await exercises.deleteOne({ userId, _id })
  return _id
}

//----------
// MODIFIER
//----------

export async function addModifier(modifier: Modifier): Promise<Modifier> {
  const userId = await getUserId()
  await modifiers.insertOne({ ...modifier, userId })
  return modifier
}

export async function fetchModifiers(): Promise<Modifier[]> {
  const userId = await getUserId()
  return await modifiers
    .find({ userId }, { projection: { userId: 0 } })
    .toArray()
}

export async function updateModifierFields(
  _id: string,
  updates: Partial<Modifier>
): Promise<Modifier> {
  const userId = await getUserId()
  const oldModifier = await modifiers.find({ userId, _id }).next()
  if (updates.name) {
    await exercises.updateMany(
      { userId, modifiers: oldModifier?.name },
      { $set: { 'modifiers.$': updates.name } }
    )
    // nested $[] operator (cannot use simple $ operator more than once): https://jira.mongodb.org/browse/SERVER-831
    await exercises.updateMany(
      { userId, 'notes.tags': oldModifier?.name },
      { $set: { 'notes.$[].tags.$[tag]': updates.name } },
      { arrayFilters: [{ tag: oldModifier?.name }] }
    )
    await records.updateMany(
      { userId, category: oldModifier?.name },
      { $set: { category: updates.name } }
    )
    await records.updateMany(
      { userId, activeModifiers: oldModifier?.name },
      { $set: { 'activeModifiers.$': updates.name } }
    )
  }
  return (await modifiers.findOneAndUpdate(
    { userId, _id },
    { $set: updates },
    {
      projection: { userId: 0 },
      returnDocument: 'after',
    }
  )) as Modifier
}

export async function deleteModifier(_id: string) {
  const userId = await getUserId()
  const modifier = await modifiers.findOne({ userId, _id })

  if (modifier) {
    const userExercises = await exercises.find({ userId }).toArray()
    const usedExercise = userExercises.find((exercise) =>
      exercise.modifiers.includes(modifier.name)
    )

    if (usedExercise) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Cannot delete modifier: used in exercise "${usedExercise.name}"`
      )
    }

    await modifiers.deleteOne({ userId, _id })
  }

  return _id
}

//----------
// CATEGORY
//----------

export async function addCategory(category: Category): Promise<Category> {
  const userId = await getUserId()
  await categories.insertOne({ ...category, userId })
  return category
}

export async function fetchCategories(): Promise<Category[]> {
  const userId = await getUserId()
  return await categories
    .find({ userId }, { projection: { userId: 0 } })
    .toArray()
}

export async function updateCategoryFields(
  _id: string,
  updates: Partial<Category>
): Promise<Category> {
  const userId = await getUserId()
  const oldCategory = await categories.find({ userId, _id }).next()
  if (updates.name) {
    await exercises.updateMany(
      { userId, categories: oldCategory?.name },
      { $set: { 'categories.$': updates.name } }
    )
    await records.updateMany(
      { userId, category: oldCategory?.name },
      { $set: { category: updates.name } }
    )
  }

  return (await categories.findOneAndUpdate(
    { userId, _id },
    { $set: updates },
    {
      projection: { userId: 0 },
      returnDocument: 'after',
    }
  )) as Category
}

export async function deleteCategory(_id: string) {
  const userId = await getUserId()
  const category = await categories.findOne({ userId, _id })

  if (category) {
    const userExercises = await exercises.find({ userId }).toArray()
    const usedExercise = userExercises.find((exercise) =>
      exercise.categories.includes(category.name)
    )

    if (usedExercise) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Cannot delete category: used in exercise "${usedExercise.name}"`
      )
    }

    await categories.deleteOne({ userId, _id })
  }

  return _id
}

//------------
// BODYWEIGHT
//------------

/** The default start/end values compare against the first char of the date (ie, the first digit of the year).
 *  So '0' is equivalent to year 0000 and '9' is equivalent to year 9999
 */
export async function fetchBodyweights(
  tmpId: ObjectId | undefined,
  filter: Filter<Bodyweight>,
  { limit, start = '0', end = '9', sort, date }: DateRangeQuery
): Promise<Bodyweight[]> {
  const userId = tmpId ?? (await getUserId())
  return await bodyweightHistory
    .find(
      { userId, date: date ?? { $gte: start, $lte: end }, ...filter },
      { projection: { userId: 0, _id: 0 } }
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
export async function upsertBodyweight(
  newBodyweight: Bodyweight
): Promise<Bodyweight> {
  const userId = await getUserId()
  return (await bodyweightHistory.findOneAndUpdate(
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
    }
  )) as Bodyweight
}
