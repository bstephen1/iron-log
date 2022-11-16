import { Filter } from 'mongodb'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import Modifier from '../../models/Modifier'
import Record from '../../models/Record'
import Session from '../../models/Session'
import db from './mongoConnect'

const sessions = db.collection<Session>('sessions')
const exercises = db.collection<Exercise>('exercises')
const modifiers = db.collection<Modifier>('modifiers')
const categories = db.collection<Category>('categories')
const records = db.collection<Record>('records')

interface updateFieldsProps<T extends { _id: string }> {
  id: T['_id']
  updates: Partial<T>
}

//---------
// SESSION
//---------

export async function addSession(session: Session) {
  return await sessions.insertOne(session)
}

export async function fetchSession(date: string) {
  return await sessions.findOne({ date })
}

export async function updateSession(session: Session) {
  return await sessions.replaceOne({ date: session.date }, session, {
    upsert: true,
  })
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
  return await records.find({ ...filter }).toArray()
}

// todo: update record if exercise has been modified since last fetch
export async function fetchRecord(id: Record['_id']) {
  return await records
    .aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'exercises',
          localField: 'exercise._id',
          foreignField: '_id',
          as: 'exercise',
        },
      },
      { $unwind: '$exercise' },
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

export async function fetchExercise(id: string) {
  return await exercises.findOne({ _id: id })
}

export async function updateExercise(exercise: Exercise) {
  // upsert creates a new record if it couldn't find one to update
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

export async function addModifier(modifier: Modifier) {
  return await modifiers.insertOne(modifier)
}

export async function fetchModifiers(filter?: Filter<Modifier>) {
  return await modifiers.find({ ...filter }).toArray()
}

export async function fetchModifier(name: string) {
  return await modifiers.findOne({ name }, { projection: { _id: false } })
}

export async function updateModifier(modifier: Modifier) {
  // upsert creates a new record if it couldn't find one to update
  return await modifiers.replaceOne({ _id: modifier._id }, modifier, {
    upsert: true,
  })
}

export async function updateModifierFields({
  id,
  updates,
}: updateFieldsProps<Modifier>) {
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

export async function fetchCategory(name: string) {
  return await categories.findOne({ name }, { projection: { _id: false } })
}

export async function updateCategory(category: Category) {
  return await categories.replaceOne({ _id: category._id }, category, {
    upsert: true,
  })
}

export async function updateCategoryFields({
  id,
  updates,
}: updateFieldsProps<Category>) {
  return await categories.updateOne({ _id: id }, { $set: updates })
}
