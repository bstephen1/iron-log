import { Filter, ObjectId } from 'mongodb'
import Bodyweight from '../../models/Bodyweight'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import Modifier from '../../models/Modifier'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'
import { db } from './mongoConnect'

/** add userId, an extra field only visible to mongo records */
type WithUserId<T> = { userId: ObjectId } & T

const sessions = db.collection<WithUserId<SessionLog>>('sessions')
const exercises = db.collection<Exercise>('exercises')
const modifiers = db.collection<WithUserId<Modifier>>('modifiers')
const categories = db.collection<Category>('categories')
const records = db.collection<Record>('records')
const bodyweightHistory = db.collection<Bodyweight>('bodyweightHistory')

interface updateFieldsProps<T extends { _id: string }> {
  id: T['_id']
  updates: Partial<T>
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
export async function deleteSessionRecord({
  date,
  recordId,
}: {
  date: string
  recordId: string
}) {
  await sessions.updateOne({ date }, { $pull: { records: recordId } })
  await deleteRecord(recordId)
  return
}

// todo: fetch sessions in date range

//--------
// RECORD
//--------

export async function addRecord(record: Record) {
  return await records.insertOne(record)
}

// todo: pagination
export async function fetchRecords(filter?: Filter<Record>) {
  // find() returns a cursor, so it has to be converted to an array
  return await records
    .aggregate([
      { $match: filter },
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
    ])
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

export async function updateRecord(record: Record) {
  return await records.replaceOne({ _id: record._id }, record, {
    upsert: true,
  })
}

export async function updateRecordFields({
  id,
  updates,
}: updateFieldsProps<Record>) {
  return await records.updateOne({ _id: id }, { $set: updates })
}

// Currently not exporting. To delete call deleteSessionRecord().
// All Records must belong to a Session, so a record can only be deleted in the context of a Session.
async function deleteRecord(id: string) {
  return await records.deleteOne({ _id: id })
}

//----------
// EXERCISE
//----------

export async function addExercise(exercise: Exercise) {
  return await exercises.insertOne(exercise)
}

export async function fetchExercises(filter?: Filter<Exercise>) {
  return await exercises.find({ ...filter }).toArray()
}

export async function fetchExercise(userId: ObjectId, _id: string) {
  return await exercises.findOne({ userId, _id }, { projection: { userId: 0 } })
}

export async function updateExercise(exercise: Exercise) {
  return await exercises.replaceOne({ _id: exercise._id }, exercise, {
    upsert: true,
  })
}

export async function updateExerciseFields({
  id,
  updates,
}: updateFieldsProps<Exercise>) {
  return await exercises.updateOne({ _id: id }, { $set: updates })
}

//----------
// MODIFIER
//----------

export async function addModifier(userId: ObjectId, modifier: Modifier) {
  return await modifiers.insertOne({ ...modifier, userId })
}

export async function fetchModifiers(filter?: Filter<Modifier>) {
  return await modifiers.find({ ...filter }).toArray()
}

export async function fetchModifier(userId: ObjectId, name: string) {
  return await modifiers.findOne(
    { userId, name },
    { projection: { userId: 0, _id: 0 } }
  )
}

export async function updateModifierFields({
  id,
  updates,
}: updateFieldsProps<Modifier>) {
  if (updates.name) {
    const oldModifier = await modifiers.find({ _id: id }).next()
    await exercises.updateMany(
      { modifiers: oldModifier?.name },
      { $set: { 'modifiers.$': updates.name } }
    )
    // nested $[] operator (cannot use simple $ operator more than once): https://jira.mongodb.org/browse/SERVER-831
    // typescript isn't recognizing notes.$[].tags.$[tag] as a valid signature for $set even though it works and is the recommended way to do it
    await exercises.updateMany(
      { 'notes.tags': oldModifier?.name },
      { $set: { 'notes.$[].tags.$[tag]': updates.name } as any },
      { arrayFilters: [{ tag: oldModifier?.name }] }
    )
    await records.updateMany(
      { category: oldModifier?.name },
      { $set: { category: updates.name } }
    )
    await records.updateMany(
      { activeModifiers: oldModifier?.name },
      { $set: { 'activeModifiers.$': updates.name } }
    )
  }
  return await modifiers.updateOne({ _id: id }, { $set: updates })
}

//----------
// CATEGORY
//----------

export async function addCategory(category: Category) {
  return await categories.insertOne(category)
}

export async function fetchCategories(filter?: Filter<Category>) {
  return await categories.find({ ...filter }).toArray()
}

export async function fetchCategory(userId: ObjectId, name: string) {
  return await categories.findOne(
    { userId, name },
    { projection: { userId: 0, _id: 0 } }
  )
}

export async function updateCategoryFields({
  id,
  updates,
}: updateFieldsProps<Category>) {
  // todo: should this be a transaction? Apparently that requires a cluster
  // can run single testing node as cluster with mongod --replset rs0
  if (updates.name) {
    const oldCategory = await categories.find({ _id: id }).next()
    await exercises.updateMany(
      { categories: oldCategory?.name },
      { $set: { 'categories.$': updates.name } }
    )
    await records.updateMany(
      { category: oldCategory?.name },
      { $set: { category: updates.name } }
    )
  }
  return await categories.updateOne({ _id: id }, { $set: updates })
}

//------------
// BODYWEIGHT
//------------

export async function addBodyweight(bodyweight: Bodyweight) {
  return await bodyweightHistory.insertOne(bodyweight)
}

/** The default start/end values compare against the first char of the date (ie, the first digit of the year).
 *  So '0' is equivalent to year 0000 and '9' is equivalent to year 9999
 */
export async function fetchBodyweightHistory(
  limit?: number,
  start = '0',
  end = '9'
) {
  // -1 sorts most recent first
  return await bodyweightHistory
    .find({ date: { $gte: start, $lte: end } })
    .sort({ date: -1 })
    .limit(limit ?? 50)
    .toArray()
}

export async function updateBodyweight(bodyweight: Bodyweight) {
  return await bodyweightHistory.updateOne(
    { date: bodyweight.date },
    { $set: { value: bodyweight.value } },
    {
      upsert: true,
    }
  )
}

export async function deleteBodyweight(date: string) {
  return await bodyweightHistory.deleteOne({ date })
}
