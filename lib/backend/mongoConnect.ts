import { MongoClient, type W } from 'mongodb'
import { generateId } from '../../lib/util'

// pkFactory overwrites the default mongo _id generation
const options = { w: 'majority' as W, pkFactory: { createPk: generateId } }
let client: MongoClient
/** Connection to mongo using MONGODB_URI env var */
let clientPromise: Promise<MongoClient>

// This is based on the vercel nextjs example: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.ts
// which is also recommended in the next-auth docs: https://authjs.dev/reference/adapter/mongodb

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is undefined! Define in .env')
}

const uri = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

const db = (await clientPromise).db(process.env.MONGODB_NAME)

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { client, clientPromise, db }
