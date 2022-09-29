import { Document, MongoClient, WithId } from 'mongodb';
import { DayRecord } from '../../models/record/DayRecord';

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri);
let clientPromise = client.connect()
const dbName = 'test'

export async function createMongoConnection() {
    await client.connect()
    const db = client.db(dbName)
    return db
}

export async function fetchCollection(name: string) {
    const client = await clientPromise
    const collection = client.db(dbName).collection(name)
    let documents: WithId<Document>[] = []
    await collection.find({}, { projection: { _id: false } }).forEach(document => { documents.push(document) })

    return documents
}

export async function fetchRecord(date: string) {
    const client = await clientPromise
    return await client.db(dbName).collection('records').findOne({ date: date }, { projection: { _id: false } })
}

export async function createRecord(record: DayRecord) {
    const client = await clientPromise
    return await client.db(dbName).collection('records').insertOne(record)
}
