import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is undefined! Define in .env')
} else if (!process.env.MONGODB_NAME) {
  throw new Error('MONGODB_NAME is undefined! Define in .env')
}

const rawClient = new MongoClient(process.env.MONGODB_URI as string)
const client = await rawClient.connect()
const db = client.db(process.env.MONGODB_NAME)

console.log('connecting to ' + process.env.MONGODB_URI)

export default db
