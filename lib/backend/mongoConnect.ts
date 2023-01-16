import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is undefined! Define in .env')
} else if (!process.env.MONGODB_NAME) {
  throw new Error('MONGODB_NAME is undefined! Define in .env')
}

const uri = process.env.MONGODB_URI
const options = {}

console.log('connecting to ' + uri)

const client = new MongoClient(uri, options)

// NextAuth mongo adapter needs the promise
export const clientPromise = client.connect()
export const db = (await clientPromise).db(process.env.MONGODB_NAME)
