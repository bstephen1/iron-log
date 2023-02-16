import { Filter, ObjectId } from 'mongodb'
import Bodyweight from '../../models/Bodyweight'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import Modifier from '../../models/Modifier'
import {
  ArrayMatchType,
  MatchTypes,
  MongoQuery,
} from '../../models/query-filters/MongoQuery'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'
import { db } from './mongoConnect'

/** add userId, an extra field only visible to mongo records */
type WithUserId<T> = { userId: ObjectId } & T

const sessions = db.collection<WithUserId<SessionLog>>('sessions')
const exercises = db.collection<WithUserId<Exercise>>('exercises')
const modifiers = db.collection<WithUserId<Modifier>>('modifiers')
const categories = db.collection<WithUserId<Category>>('categories')
const records = db.collection<WithUserId<Record>>('records')
const bodyweightHistory =
  db.collection<WithUserId<Bodyweight>>('bodyweightHistory')

interface UpdateFieldsProps<T extends { _id: string }> {
  id: T['_id']
  updates: Partial<T>
}

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
    switch (matchTypes[key]) {
      case ArrayMatchType.All:
        // typescript complaining for some reason. May or may not be a better way to silence it.
        filter[key] = { $all: filter[key] } as any
        break
      case ArrayMatchType.Any:
        filter[key] = { $in: filter[key] } as any
        break
      case ArrayMatchType.Equivalent:
        // Note: for standard exact matches, order of array elements matters.
        // It is possible, but potentially expensive to query for an exact match where order
        // doesn't matter (ie, the "equivalent" matchType). Alternatively, arrays should be sorted on insertion.
        // The latter provides for some pretty clunky ux when editing Autocomplete chips, so
        // we are opting for the former unless performance notably degrades.
        // See: https://stackoverflow.com/questions/29774032/mongodb-find-exact-array-match-but-order-doesnt-matter
        filter[key] = { $size: filter[key].length, $all: filter[key] } as any
        break
      case ArrayMatchType.Exact:
      default:
        // do nothing
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

export async function addSession(userId: ObjectId, sessionLog: SessionLog) {
  return await sessions.insertOne({ ...sessionLog, userId })
}

export async function fetchSession(userId: ObjectId, date: string) {
  return (await sessions.findOne(
    { userId, date },
    { projection: { userId: 0 } }
  )) as SessionLog
}

/** The default start/end values compare against the first char of the date (ie, the first digit of the year).
 *  So '0' is equivalent to year 0000 and '9' is equivalent to year 9999
 */
export async function fetchSessions({
  userId,
  limit,
  start = '0',
  end = '9',
}: MongoQuery<SessionLog>) {
  // -1 sorts most recent first
  return await sessions
    .find(
      { userId, date: { $gte: start, $lte: end } },
      { projection: { userId: 0 } }
    )
    .sort({ date: -1 })
    .limit(limit ?? 50)
    .toArray()
}

export async function updateSession(userId: ObjectId, sessionLog: SessionLog) {
  return await sessions.replaceOne(
    { userId, date: sessionLog.date },
    { ...sessionLog, userId },
    {
      upsert: true,
    }
  )
}

// todo: make this a transaction?
export async function deleteSessionRecord(
  userId: ObjectId,
  date: string,
  recordId: string
) {
  // $pull is equivalent to removing an element from an array
  await sessions.updateOne({ userId, date }, { $pull: { records: recordId } })
  await deleteRecord(userId, recordId)
  return
}

// todo: fetch sessions in date range

//--------
// RECORD
//--------

export async function addRecord(userId: ObjectId, record: Record) {
  return await records.insertOne({ ...record, userId })
}

// todo: pagination
export async function fetchRecords({
  filter,
  limit,
  start = '0',
  end = '9',
  userId,
  matchTypes,
}: MongoQuery<Record>) {
  setArrayMatchTypes(filter, matchTypes)

  // find() returns a cursor, so it has to be converted to an array
  return await records
    .aggregate([
      // date range will be overwritten if a specific date is given in the filter
      { $match: { date: { $gte: start, $lte: end }, ...filter, userId } },
      {
        $lookup: {
          from: 'exercises',
          localField: 'exercise._id',
          foreignField: '_id',
          as: 'exercise',
        },
      },
      // if preserveNull is false the whole record becomes null if exercise is null
      { $unwind: { path: '$exercise', preserveNullAndEmptyArrays: true } },
      { $project: { userId: 0 } },
    ])
    .sort({ date: -1 })
    .limit(limit ?? 50)
    .toArray()
}

// todo: update record if exercise has been modified since last fetch
export async function fetchRecord(userId: ObjectId, _id: Record['_id']) {
  return await records
    .aggregate([
      { $match: { userId, _id } },
      {
        $lookup: {
          from: 'exercises',
          localField: 'exercise._id',
          foreignField: '_id',
          as: 'exercise',
        },
      },
      // if preserveNull is false the whole record becomes null if exercise is null
      { $unwind: { path: '$exercise', preserveNullAndEmptyArrays: true } },
      // $project is the equivalent of "projection" for aggregate pipelines
      { $project: { userId: 0 } },
    ])
    // return just the first (there's only the one)
    .next()
}

export async function updateRecord(userId: ObjectId, record: Record) {
  return await records.replaceOne(
    { userId, _id: record._id },
    { ...record, userId },
    {
      upsert: true,
    }
  )
}

export async function updateRecordFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Record>
) {
  return await records.updateOne({ userId, _id: id }, { $set: updates })
}

// Currently not exporting. To delete call deleteSessionRecord().
// All Records must belong to a Session, so a record can only be deleted in the context of a Session.
async function deleteRecord(userId: ObjectId, _id: string) {
  return await records.deleteOne({ userId, _id })
}

//----------
// EXERCISE
//----------

export async function addExercise(userId: ObjectId, exercise: Exercise) {
  return await exercises.insertOne({ ...exercise, userId })
}

/** This fetch supports the array field "categories". By default, a query on categories
 * will match records that contain any one of the given categories array.
 */
export async function fetchExercises({
  userId,
  filter,
  matchTypes,
}: MongoQuery<Exercise>) {
  setArrayMatchTypes(filter, matchTypes)

  return await exercises
    .find({ ...filter, userId }, { projection: { userId: 0 } })
    .toArray()
}

export async function fetchExercise(userId: ObjectId, _id: string) {
  return await exercises.findOne({ userId, _id }, { projection: { userId: 0 } })
}

// todo: add guard to anything with Status such that Status.new cannot be saved to db.
export async function updateExercise(userId: ObjectId, exercise: Exercise) {
  return await exercises.replaceOne(
    { userId, _id: exercise._id },
    { ...exercise, userId },
    {
      upsert: true,
    }
  )
}

export async function updateExerciseFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Exercise>
) {
  return await exercises.updateOne({ userId, _id: id }, { $set: updates })
}

//----------
// MODIFIER
//----------

export async function addModifier(userId: ObjectId, modifier: Modifier) {
  return await modifiers.insertOne({ ...modifier, userId })
}

export async function fetchModifiers({ filter, userId }: MongoQuery<Modifier>) {
  return await modifiers
    .find({ ...filter, userId }, { projection: { userId: 0 } })
    .toArray()
}

export async function fetchModifier(userId: ObjectId, name: string) {
  return await modifiers.findOne(
    { userId, name },
    { projection: { userId: 0, _id: 0 } }
  )
}

export async function updateModifierFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Modifier>
) {
  if (updates.name) {
    const oldModifier = await modifiers.find({ userId, _id: id }).next()
    await exercises.updateMany(
      { userId, modifiers: oldModifier?.name },
      { $set: { 'modifiers.$': updates.name } }
    )
    // nested $[] operator (cannot use simple $ operator more than once): https://jira.mongodb.org/browse/SERVER-831
    // typescript isn't recognizing notes.$[].tags.$[tag] as a valid signature for $set even though it works and is the recommended way to do it
    await exercises.updateMany(
      { userId, 'notes.tags': oldModifier?.name },
      { $set: { 'notes.$[].tags.$[tag]': updates.name } as any },
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
  return await modifiers.updateOne({ userId, _id: id }, { $set: updates })
}

//----------
// CATEGORY
//----------

export async function addCategory(userId: ObjectId, category: Category) {
  return await categories.insertOne({ ...category, userId })
}

export async function fetchCategories(filter?: Filter<Category>) {
  return await categories
    .find({ ...filter }, { projection: { userId: 0 } })
    .toArray()
}

export async function fetchCategory(userId: ObjectId, name: string) {
  return await categories.findOne(
    { userId, name },
    { projection: { userId: 0, _id: 0 } }
  )
}

export async function updateCategoryFields(
  userId: ObjectId,
  { id, updates }: UpdateFieldsProps<Category>
) {
  // todo: should this be a transaction? Apparently that requires a cluster
  // can run single testing node as cluster with mongod --replset rs0
  if (updates.name) {
    const oldCategory = await categories.find({ userId, _id: id }).next()
    await exercises.updateMany(
      { userId, categories: oldCategory?.name },
      { $set: { 'categories.$': updates.name } }
    )
    await records.updateMany(
      { userId, category: oldCategory?.name },
      { $set: { category: updates.name } }
    )
  }
  return await categories.updateOne({ userId, _id: id }, { $set: updates })
}

//------------
// BODYWEIGHT
//------------

export async function addBodyweight(userId: ObjectId, bodyweight: Bodyweight) {
  return await bodyweightHistory.insertOne({ ...bodyweight, userId })
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
}: MongoQuery<Bodyweight>) {
  // -1 sorts most recent first
  return await bodyweightHistory
    .find(
      { userId, dateTime: { $gte: start, $lte: end }, ...filter },
      { projection: { userId: 0, _id: 0 } }
    )
    .sort({ dateTime: -1 })
    .limit(limit ?? 50)
    .toArray()
}

/** if updating at the same dateTime, it will overwrite. This allows for updating an existing bodyweight
 * instead of always making a new one.
 *
 * Note: two records can exist at the same time if they are different types.
 */
export async function updateBodyweight(
  userId: ObjectId,
  newBodyweight: Bodyweight
) {
  return await bodyweightHistory.updateOne(
    { userId, dateTime: newBodyweight.dateTime, type: newBodyweight.type },
    { $set: newBodyweight },
    {
      upsert: true,
    }
  )
}

// todo: use id, not dateTime.
export async function deleteBodyweight(userId: ObjectId, dateTime: string) {
  return await bodyweightHistory.deleteOne({ userId, dateTime })
}
