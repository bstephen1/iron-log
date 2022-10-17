import { Collection, Document, MongoClient, ObjectId, WithId } from 'mongodb';
import Exercise from '../../models/Exercise';
import { Session } from '../../models/Session';

const uri = 'mongodb://localhost:27017'
const rawClient = new MongoClient(uri)
let client = await rawClient.connect()
const db = client.db(process.env.DB_NAME)

const sessions = db.collection('sessions')
const exercises = db.collection('exercises')
const modifiers = db.collection('modifiers')

//todo: set up ts types?
async function fetchCollection(collection: Collection, constraints: { [key: string]: string } = {}) {
    //we need to construct the array because find() returns a cursor
    let documents: WithId<Document>[] = []
    await collection.find(constraints).forEach(document => { documents.push(document) })
    return documents
}

export async function fetchSession(date: string) {
    return await sessions.findOne({ date: date }, { projection: { _id: false } })
}

export async function createSession(session: Session) {
    return await sessions.insertOne(session)
}

export async function updateSession(session: Session) {
    return await sessions.replaceOne({ date: session.date }, session)
}

export async function fetchExercises(constraints?: { [key: string]: string }) {
    return await fetchCollection(exercises, constraints)
}

export async function fetchExercise(name: string) {
    return await exercises.findOne({ name: name }, { projection: { _id: false } })
}

//we don't want to create with a mongo id on the front end... or do we...?
export async function createExercise(exercise: Exercise) {
    // return await client.db(dbName).collection('exercises').insertOne(exercise)
    return
}

export async function updateExercise(exercise: Exercise) {
    const convertedId = new ObjectId(exercise._id) //the ObjectId gets treated as a string afterJSONifying, so we need to convert it back
    return await exercises.replaceOne({ _id: exercise._id }, { ...exercise, _id: convertedId })
}


export async function fetchModifiers(constraints?: { [key: string]: string }) {
    return await fetchCollection(modifiers, constraints)
}

//todo: seperate methods for updating specific fields? To reduce data load on small updates?
//todo: make exercise in exercisesessions a reference to exercises table