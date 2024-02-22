import { Db, MongoClient, ObjectId, W } from 'mongodb'
import { generateId } from '../../lib/util'
import Category from '../../models/AsyncSelectorOption/Category'
import Exercise from '../../models/AsyncSelectorOption/Exercise'
import Modifier from '../../models/AsyncSelectorOption/Modifier'
import Bodyweight from '../../models/Bodyweight'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'

/** add userId, an extra field only visible to mongo records */
type WithUserId<T> = { userId: ObjectId } & T

// pkFactory overwrites the default mongo _id generation
const options = { w: 'majority' as W, pkFactory: { createPk: generateId } }
let client: MongoClient
/** Connection to mongo using MONGODB_URI env var */
let clientPromise: Promise<MongoClient>
let db: Db

// This is based on the vercel nextjs example: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.ts
// which is also recommended in the next-auth docs: https://authjs.dev/reference/adapter/mongodb

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is undefined! Define in .env')
}

const uri = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
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

if (!process.env.MONGODB_NAME) {
  throw new Error('MONGODB_NAME is undefined! Define in .env')
}

db = (await clientPromise).db(process.env.MONGODB_NAME)

/** db collections with proper typing */
const collections = {
  sessions: db.collection<WithUserId<SessionLog>>('sessions'),
  exercises: db.collection<WithUserId<Exercise>>('exercises'),
  modifiers: db.collection<WithUserId<Modifier>>('modifiers'),
  categories: db.collection<WithUserId<Category>>('categories'),
  records: db.collection<WithUserId<Record>>('records'),
  bodyweightHistory: db.collection<WithUserId<Bodyweight>>('bodyweightHistory'),
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise, db, collections, client }
