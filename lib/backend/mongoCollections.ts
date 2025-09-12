import type { ObjectId } from 'mongodb'
import type { Category } from '../../models/AsyncSelectorOption/Category'
import type { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import type { Modifier } from '../../models/AsyncSelectorOption/Modifier'
import type { Bodyweight } from '../../models/Bodyweight'
import type { Record } from '../../models/Record'
import type { SessionLog } from '../../models/SessionLog'
import { db } from './mongoConnect'

/** add userId, an extra field only visible to mongo records */
export type WithUserId<T> = { userId: ObjectId } & T

export const sessions = db.collection<WithUserId<SessionLog>>('sessions')
export const exercises = db.collection<WithUserId<Exercise>>('exercises')
export const modifiers = db.collection<WithUserId<Modifier>>('modifiers')
export const categories = db.collection<WithUserId<Category>>('categories')
export const records = db.collection<WithUserId<Record>>('records')
export const bodyweightHistory =
  db.collection<WithUserId<Bodyweight>>('bodyweightHistory')
