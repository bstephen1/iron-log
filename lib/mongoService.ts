import { Document, MongoClient, WithId } from 'mongodb';

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url);
const dbName = 'test'

export async function createMongoConnection() {
    await client.connect()
    const db = client.db(dbName)

    return db
}

export async function fetchCollection(name: string) {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(name)
    let documents: WithId<Document>[] = []
    await collection.find({}, { projection: { _id: false } }).forEach(document => { documents.push(document) })

    return documents
}