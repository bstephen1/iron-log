import { Collection, Document, Filter, MongoClient, WithId } from 'mongodb';
import Exercise from '../../models/Exercise';
import { Session } from '../../models/Session';

const uri = 'mongodb://localhost:27017'
const rawClient = new MongoClient(uri)
let client = await rawClient.connect()
const db = client.db(process.env.DB_NAME)

const sessions = db.collection('sessions')
const exercises = db.collection<Exercise>('exercises')
const modifiers = db.collection('modifiers')

async function fetchCollection<T extends Document>(collection: Collection<T>, constraints: Filter<T> = {}) {
    //we need to construct the array because find() returns a cursor
    let documents: WithId<T>[] = []
    await collection.find(constraints).forEach(document => { documents.push(document) })
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

//----------
// EXERCISE
//----------

export async function addExercise(exercise: Exercise) {
    return await exercises.insertOne(exercise)
}

export async function fetchExercises(filter?: Filter<Exercise>) {
    return await fetchCollection(exercises, filter)
}

export async function fetchExercise(name: string) {
    return await exercises.findOne({ name: name }, { projection: { _id: false } })
}

export async function updateExercise(exercise: Exercise) {
    //upsert creates a new record if it couldn't find one to update
    return await exercises.replaceOne({ _id: exercise._id }, exercise, { upsert: true })
}

//----------
// MODIFIER
//----------

export async function fetchModifiers(constraints?: { [key: string]: string }) {
    return await fetchCollection(modifiers, constraints)
}

//todo: seperate methods for updating specific fields? To reduce data load on small updates?