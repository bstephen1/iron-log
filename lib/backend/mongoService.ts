import { Collection, Document, Filter, MongoClient, WithId } from 'mongodb'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import Modifier from '../../models/Modifier'
import Record from '../../models/Record'
import Session from '../../models/Session'

const uri = 'mongodb://localhost:27017'
const rawClient = new MongoClient(uri)
let client = await rawClient.connect()
const db = client.db(process.env.DB_NAME)

const sessions = db.collection<Session>('sessions')
const exercises = db.collection<Exercise>('exercises')
const modifiers = db.collection<Modifier>('modifiers')
const categories = db.collection<Category>('categories')
const records = db.collection<Record>('records')

// todo: can use toArray() for iterators instead of pushing
async function fetchCollection<T extends Document>(
  collection: Collection<T>,
  constraints: Filter<T> = {}
) {
  // we need to construct the array because find() returns a cursor
  let documents: WithId<T>[] = []
  await collection.find(constraints).forEach((document) => {
    documents.push(document)
  })
  return documents
}

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
  return await sessions.findOne({ date: date }, { projection: { _id: false } })
}

export async function updateSession(session: Session) {
  return await sessions.replaceOne({ date: session.date }, session, {
    upsert: true,
  })
}

// todo: fetch sessions in date range

//--------
// RECORD
//--------

export async function addRecord(record: Record) {
  return await records.insertOne(record)
}

// todo: aggregate doesn't work with Filter
export async function fetchRecords(filter?: Filter<Record>) {
  // replace exercise ID with full exercise
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

//----------
// EXERCISE
//----------

export async function addExercise(exercise: Exercise) {
  return await exercises.insertOne(exercise)
}

export async function fetchExercises(filter?: Filter<Exercise>) {
  return await fetchCollection(exercises, filter)
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
  return await fetchCollection(modifiers, filter)
}

export async function fetchModifier(name: string) {
  return await modifiers.findOne({ name: name }, { projection: { _id: false } })
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
  return await fetchCollection(categories, filter)
}

export async function fetchCategory(name: string) {
  return await categories.findOne(
    { name: name },
    { projection: { _id: false } }
  )
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
