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
  return await sessions.replaceOne({ date: session.date }, session)
}

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

export async function fetchRecord(id: Record['_id']) {
  return await records.findOne({ _id: id })
}

export async function updateRecord(record: Record) {
  return await records.replaceOne({ _id: record._id }, record, {
    upsert: true,
  })
}

interface updateRecordFieldProps<T extends keyof Record> {
  id: Record['_id']
  field: T
  value: Record[T] | any
}
export async function updateRecordField<T extends keyof Record>({
  id,
  field,
  value,
}: updateRecordFieldProps<T>) {
  return await records.updateOne({ _id: id }, { $set: { [field]: value } })
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

interface updateExerciseFieldProps<T extends keyof Exercise> {
  id: Exercise['_id']
  field: T
  value: Exercise[T] | any // todo $set is complaining bc it adds fields for each array index
}
export async function updateExerciseField<T extends keyof Exercise>({
  id,
  field,
  value,
}: updateExerciseFieldProps<T>) {
  return await exercises.updateOne({ _id: id }, { $set: { [field]: value } })
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
  // upsert creates a new record if it couldn't find one to update
  return await categories.replaceOne({ _id: category._id }, category, {
    upsert: true,
  })
}
