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

let clientPromise: Promise<MongoClient> | undefined

/** return db collections with proper typing */
export const getCollections = (db: Db) => ({
  sessions: db.collection<WithUserId<SessionLog>>('sessions'),
  exercises: db.collection<WithUserId<Exercise>>('exercises'),
  modifiers: db.collection<WithUserId<Modifier>>('modifiers'),
  categories: db.collection<WithUserId<Category>>('categories'),
  records: db.collection<WithUserId<Record>>('records'),
  bodyweightHistory: db.collection<WithUserId<Bodyweight>>('bodyweightHistory'),
})

/** Connect to the local db. For use in scripts that don't have access to env vars.
 *  Uri and db name use the same values from env.development.
 *
 * Note: to terminate the script, client.close() must be called.
 * Also db operations are async and should be awaited.
 */
export const connectToLocalDb = async () => {
  const client = await new MongoClient(
    'mongodb://localhost:27017/test',
    options
  ).connect()

  const db = client.db('test')
  const collections = getCollections(db)

  return { client, db, collections }
}

/** create a connection to mongo using MONGODB_URI env vars */
export const createMongoConnection = () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is undefined! Define in .env')
  }

  const uri = process.env.MONGODB_URI

  console.log('connecting to ' + uri)

  const client = new MongoClient(uri, options)
  clientPromise = client.connect()

  return clientPromise
}

/** gets the db specified at the MONGODB_NAME env var*/
export const getDb = async () => {
  if (!process.env.MONGODB_NAME) {
    throw new Error('MONGODB_NAME is undefined! Define in .env')
  } else if (!clientPromise) {
    throw new Error(
      'Tried to call getDb() before createMongoConnection() could set up a connection to mongo.'
    )
  }

  return (await clientPromise).db(process.env.MONGODB_NAME)
}
