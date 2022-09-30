import { Document, MongoClient, WithId } from 'mongodb';
import { Record } from '../../models/record/Record';

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri);
let clientPromise = client.connect()
const dbName = 'test'

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

export async function createRecord(record: Record) {
    const client = await clientPromise
    return await client.db(dbName).collection('records').insertOne(record)
}

export async function updateRecord(record: Record) {
    const client = await clientPromise
    return await client.db(dbName).collection('records').updateOne({ date: record.date }, { $set: { exerciseRecords: record.exerciseRecords } })
}

//todo: seperate methods for updating specific fields? To reduce data load on small updates?