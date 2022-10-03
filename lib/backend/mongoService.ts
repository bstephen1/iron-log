import { Document, MongoClient, ObjectId, WithId } from 'mongodb';
import { Record } from '../../models/record/Record';

const uri = 'mongodb://localhost:27017'
const unconnectedClient = new MongoClient(uri);
let clientPromise = unconnectedClient.connect()
const dbName = 'test'

export async function fetchCollection(name: string) {
    const client = await clientPromise
    const collection = client.db(dbName).collection(name)
    //we need to construct the array because find() returns a cursor
    let documents: WithId<Document>[] = []
    await collection.find({}).forEach(document => { documents.push(document) })
    // await collection.find({}, { projection: { _id: false } }).forEach(document => { documents.push(document) })

    return documents
}

export async function fetchRecord(date: string) {
    const client = await clientPromise
    return await client.db(dbName).collection('records').findOne({ date: date }, { projection: { _id: false } })

}

export async function fetchExercise(id: ObjectId) {
    const client = await clientPromise
    return await client.db(dbName).collection('exercises').findOne({ _id: id }, { projection: { _id: false } })
}

export async function createRecord(record: Record) {
    const client = await clientPromise
    return await client.db(dbName).collection('records').insertOne(record)
}

export async function updateRecord(record: Record) {
    const client = await clientPromise
    return await client.db(dbName).collection('records').updateOne({ date: record.date }, { $set: { exerciseRecords: record.exerciseRecords } })
}

//todo: seperate methods for updating specific fields? To reduce data load on small updates?
//todo: make exercise in exerciseRecords a reference to exercises table