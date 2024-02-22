import { ObjectId } from 'mongodb'
import Category from '../models/AsyncSelectorOption/Category'
import {
  DisplayFields,
  ORDERED_DISPLAY_FIELDS,
  VisibleField,
} from '../models/DisplayFields'
import Exercise from '../models/AsyncSelectorOption/Exercise'
import Modifier from '../models/AsyncSelectorOption/Modifier'
import Note from '../models/Note'
import Record from '../models/Record'
import SessionLog from '../models/SessionLog'
import { DB_UNITS } from '../models/Set'
import { Status } from '../models/Status'
import './polyfills'
import { devUserId } from '../lib/frontend/constants'
import path from 'path'
import dotenv from 'dotenv'

const envPath = path.resolve(__dirname, '..', '.env.development')
dotenv.config({ path: envPath })

// must wait to import until dotenv is done pulling in env vars
const { db, collections, client } = await import('../lib/backend/mongoConnect')

const getDisplayFields = (names: VisibleField['name'][]): DisplayFields => ({
  visibleFields: ORDERED_DISPLAY_FIELDS.filter((field) =>
    names.includes(field.name)
  ),
  units: DB_UNITS,
})

const devUserObjectId = new ObjectId(devUserId)

const withId = <T>(items: T[]) =>
  items.map((item) => ({ ...item, userId: devUserObjectId }))

const categories = [
  new Category('quads'),
  new Category('squat'),
  new Category('side delts'),
  new Category('biceps'),
  new Category('hamstrings'),
  new Category('bench press'),
  new Category('chest'),
  new Category('triceps'),
  new Category('cardio'),
  new Category('strongman'),
]

const modifiers = [
  new Modifier('belt', Status.active),
  new Modifier('band', Status.archived),
  new Modifier('pause', Status.active),
  new Modifier('flared', Status.active),
  new Modifier('tucked', Status.active),
  new Modifier('wide', Status.active),
  new Modifier('narrow', Status.active),
  new Modifier('wraps', Status.active),
  new Modifier('middle', Status.active),
  new Modifier('barbell', Status.active),
  new Modifier('unilateral left', Status.active),
  new Modifier('unilateral right', Status.active),
  new Modifier('AMRAP', Status.active),
  new Modifier('myo', Status.active),
  new Modifier('bodyweight', Status.active),
]

const exercises = [
  new Exercise('high bar squats', {
    notes: [new Note('knees up'), new Note('chest up')],
    categories: ['squat'],
    modifiers: ['belt', 'band'],
  }),
  new Exercise('curls', {
    notes: [new Note('twist in', ['barbell'])],
    categories: ['biceps'],
    displayFields: getDisplayFields(['weight', 'reps']),
    modifiers: ['bodyweight', 'unilateral left', 'unilateral right', 'barbell'],
  }),
  new Exercise('multi grip bench press', {
    notes: [
      new Note('great triceps', ['tucked, middle']),
      new Note('great chest', ['flared', 'narrow']),
    ],
    categories: ['bench press', 'chest', 'triceps'],
    modifiers: [
      'flared',
      'tucked',
      'wide',
      'narrow',
      'middle',
      'belt',
      'wraps',
    ],
  }),
  new Exercise('zercher squat', {
    status: Status.archived,
    notes: [new Note('pain')],
    categories: ['squat'],
  }),
  new Exercise('running', {
    categories: ['cardio'],
    displayFields: getDisplayFields(['distance', 'time', 'effort']),
  }),
  new Exercise('yoke', {
    categories: ['strongman'],
    displayFields: getDisplayFields(['weight', 'distance', 'time', 'effort']),
  }),
]

const getExercise = (name: string) =>
  exercises.find((exercise) => exercise.name === name)

const records = [
  new Record('2022-09-26', {
    exercise: getExercise('high bar squats'),
    activeModifiers: ['belt'],
    notes: [new Note('good lifts', ['Record'])],
    sets: [
      { reps: 5, effort: 8, weight: 100 },
      { reps: 5, effort: 9, weight: 110 },
      { reps: 5, effort: 10, weight: 120 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: getExercise('curls'),
    activeModifiers: ['bodyweight'],
    notes: [new Note('good lifts', ['Record'])],
    sets: [
      { reps: 15, weight: 25 },
      { reps: 12, weight: 30 },
      { reps: 10, weight: 30 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: getExercise('running'),
    sets: [
      { distance: 50, time: 10, effort: 10 },
      { distance: 50, time: 9.83, effort: 10 },
      { distance: 50, time: 8.33, effort: 10 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: getExercise('running'),
    sets: [{ distance: 5000, time: 900, effort: 9 }],
  }),
  new Record('2022-09-26', {
    exercise: getExercise('yoke'),
    sets: [{ weight: 500, distance: 50, time: 8.5, effort: 9 }],
  }),
]

const sessions = [
  new SessionLog(
    '2022-09-26',
    records
      .filter((record) => record.date === '2022-09-26')
      .map((record) => record._id)
  ),
]

//  START OPERATIONS

await db.dropDatabase()

await collections.modifiers.insertMany(withId(modifiers))
await collections.categories.insertMany(withId(categories))
await collections.exercises.insertMany(withId(exercises))
await collections.sessions.insertMany(withId(sessions))
await collections.records.insertMany(withId(records))

await client.close()

console.log('Finished generating Dev DB. Exiting...')
