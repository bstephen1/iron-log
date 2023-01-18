import { ObjectId } from 'mongodb'
import SessionLog from '../../models/SessionLog'

export interface MongoSessionLog extends SessionLog {
  userId: ObjectId
}
