import { Document, MongoClient, ObjectId, WithId } from 'mongodb';
import { Session } from '../../models/Session';

const uri = 'mongodb://localhost:27017'
const rawClient = new MongoClient(uri)
let client = await rawClient.connect()
const dbName = 'test'

export async function fetchCollection(name: string, constraints: { [key: string]: string } = {}) {
    const collection = client.db(dbName).collection(name)
    //we need to construct the array because find() returns a cursor
    let documents: WithId<Document>[] = []
    await collection.find(constraints).forEach(document => { documents.push(document) })
    // await collection.find({}, { projection: { _id: false } }).forEach(document => { documents.push(document) })

    return documents
}

export async function fetchSession(date: string) {
    return await client.db(dbName).collection('sessions').findOne({ date: date }, { projection: { _id: false } })

}

export async function fetchExercise(name: string) {
    return await client.db(dbName).collection('exercises').findOne({ name: name }, { projection: { _id: false } })
}

export async function createSession(session: Session) {
    return await client.db(dbName).collection('sessions').insertOne(session)
}

export async function updateSession(session: Session) {
    return await client.db(dbName).collection('sessions').updateOne({ date: session.date }, { $set: { records: session.records } })
}

//todo: seperate methods for updating specific fields? To reduce data load on small updates?
//todo: make exercise in exercisesessions a reference to exercises table