import dayjs from 'dayjs'
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import path from 'path'
import { devUserId } from '../lib/frontend/constants'
import { createCategory } from '../models/AsyncSelectorOption/Category'
import { createExercise } from '../models/AsyncSelectorOption/Exercise'
import { createModifier } from '../models/AsyncSelectorOption/Modifier'
import Bodyweight from '../models/Bodyweight'
import {
  DisplayFields,
  ORDERED_DISPLAY_FIELDS,
  VisibleField,
} from '../models/DisplayFields'
import { createNote } from '../models/Note'
import Record from '../models/Record'
import SessionLog from '../models/SessionLog'
import { DB_UNITS, Units } from '../models/Set'
import { Status } from '../models/Status'
import './polyfills'

const envPath = path.resolve(__dirname, '..', '.env.development')
dotenv.config({ path: envPath })

// must wait to import until dotenv is done pulling in env vars
const { db, collections, client } = await import('../lib/backend/mongoConnect')

const getDisplayFields = (
  names: VisibleField['name'][],
  units?: Partial<Units>
): DisplayFields => ({
  visibleFields: ORDERED_DISPLAY_FIELDS.filter((field) =>
    names.includes(field.name)
  ),
  units: { ...DB_UNITS, ...units },
})

const devUserObjectId = new ObjectId(devUserId)

const withId = <T>(items: T[]) =>
  items.map((item) => ({ ...item, userId: devUserObjectId }))

const categories = {
  quads: createCategory('quads'),
  squat: createCategory('squat'),
  sideDelts: createCategory('side delts'),
  biceps: createCategory('biceps'),
  hamstrings: createCategory('hamstrings'),
  bench: createCategory('bench press'),
  chest: createCategory('chest'),
  triceps: createCategory('triceps'),
  cardio: createCategory('cardio'),
  strongman: createCategory('strongman'),
  lats: createCategory('lats'),
}

const modifiers = {
  barbell: createModifier('barbell'),
  dumbbell: createModifier('dumbbell'),
  belt: createModifier('belt'),
  band: createModifier('band'),
  pause: createModifier('pause'),
  flared: createModifier('flared elbows'),
  tucked: createModifier('tucked elbows'),
  wide: createModifier('wide grip'),
  narrow: createModifier('narrow grip'),
  middle: createModifier('middle grip'),
  wraps: createModifier('wraps'),
  amrap: createModifier('AMRAP'),
  myo: createModifier('myo'),
  pin: createModifier('lifting pin', 1.5),
  dipBelt: createModifier('dip belt', 1.5),
}

const exercises = {
  squats: createExercise('high bar squats', {
    notes: [createNote('knees out'), createNote('chest up')],
    categories: [categories.squat.name, categories.quads.name],
    modifiers: [modifiers.band.name, modifiers.belt.name],
  }),
  curls: createExercise('curls', {
    notes: [createNote('twist in', [modifiers.barbell.name])],
    categories: [categories.biceps.name],
    displayFields: getDisplayFields(['side', 'weight', 'reps']),
    modifiers: [modifiers.barbell.name, modifiers.dumbbell.name],
    attributes: { unilateral: true },
  }),
  multiGripBench: createExercise('multi grip bench press', {
    notes: [
      createNote('great for triceps', [
        modifiers.tucked.name,
        modifiers.wide.name,
      ]),
      createNote('great for chest', [
        modifiers.flared.name,
        modifiers.narrow.name,
      ]),
    ],
    categories: [
      categories.bench.name,
      categories.chest.name,
      categories.triceps.name,
    ],
    modifiers: [
      modifiers.flared.name,
      modifiers.tucked.name,
      modifiers.wide.name,
      modifiers.narrow.name,
      modifiers.middle.name,
      modifiers.belt.name,
      modifiers.wraps.name,
    ],
  }),
  zercherSquat: createExercise('zercher squat', {
    status: Status.archived,
    notes: [createNote('too painful')],
    categories: [categories.squat.name],
  }),
  sprints: createExercise('sprints', {
    categories: [categories.cardio.name],
    displayFields: getDisplayFields(['distance', 'time']),
  }),
  running: createExercise('running', {
    categories: [categories.cardio.name],
    displayFields: getDisplayFields(['distance', 'time'], {
      distance: 'km',
      time: 'min',
    }),
  }),
  yoke: createExercise('yoke', {
    categories: [categories.strongman.name],
    displayFields: getDisplayFields(['weight', 'distance', 'time', 'effort']),
  }),
  uprightRow: createExercise('upright row', {
    categories: [categories.sideDelts.name],
    modifiers: [modifiers.barbell.name, modifiers.pin.name],
    displayFields: getDisplayFields(['weight', 'reps']),
  }),
  chinUps: createExercise('chinups', {
    categories: [categories.biceps.name, categories.lats.name],
    modifiers: [modifiers.dipBelt.name],
    attributes: { bodyweight: true },
    displayFields: getDisplayFields(['plateWeight', 'totalWeight', 'reps']),
  }),
}

const records = [
  new Record('2022-09-20', {
    exercise: exercises.squats,
    activeModifiers: ['belt'],
    notes: [createNote('Very tired today', ['Session'])],
    setType: { operator: 'exactly', value: 6, field: 'reps' },
    sets: [
      { reps: 6, effort: 8, weight: 100 },
      { reps: 6, effort: 9, weight: 100 },
      { reps: 6, effort: 9, weight: 100 },
    ],
  }),
  new Record('2022-09-22', {
    exercise: exercises.squats,
    activeModifiers: ['belt'],
    setType: { operator: 'exactly', value: 6, field: 'reps' },
    sets: [
      { reps: 6, effort: 8, weight: 100 },
      { reps: 6, effort: 8, weight: 100 },
      { reps: 6, effort: 9, weight: 110 },
    ],
  }),
  new Record('2022-09-24', {
    exercise: exercises.squats,
    activeModifiers: ['belt'],
    setType: { operator: 'exactly', value: 6, field: 'reps' },
    sets: [
      { reps: 6, effort: 8, weight: 100 },
      { reps: 6, effort: 9, weight: 110 },
      { reps: 6, effort: 10, weight: 110 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: exercises.squats,
    activeModifiers: ['belt'],
    notes: [
      createNote('felt great', ['Set 1']),
      createNote('felt heavy', ['Set 3']),
    ],
    setType: { operator: 'exactly', value: 6, field: 'reps' },
    sets: [
      { reps: 6, effort: 7, weight: 100 },
      { reps: 6, effort: 8.5, weight: 110 },
      { reps: 6, effort: 10, weight: 120 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: exercises.curls,
    activeModifiers: [modifiers.dumbbell.name],
    notes: [createNote('felt great', ['Record'])],
    setType: { operator: 'between', min: 10, max: 15, field: 'reps' },
    sets: [
      { reps: 15, weight: 25 },
      { reps: 12, weight: 30, side: 'L' },
      { reps: 10, weight: 30, side: 'R' },
      { reps: 10, weight: 30 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: exercises.sprints,
    setType: { operator: 'exactly', value: 50, field: 'distance' },
    sets: [
      { distance: 50, time: 10 },
      { distance: 50, time: 9.83 },
      { distance: 50, time: 8.33 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: exercises.running,
    setType: { operator: 'exactly', value: 5, field: 'distance' },
    sets: [{ distance: 5000, time: 900 }],
  }),
  new Record('2022-09-26', {
    exercise: exercises.yoke,
    setType: { operator: 'exactly', value: 50, field: 'distance' },
    sets: [{ weight: 500, distance: 50, time: 8.5, effort: 9 }],
  }),
  new Record('2022-09-26', {
    exercise: exercises.uprightRow,
    setType: { operator: 'at most', value: 20, field: 'reps' },
    sets: [
      { weight: 20, reps: 20 },
      { weight: 20, reps: 18 },
      { weight: 20, reps: 17 },
    ],
  }),
  new Record('2022-09-26', {
    exercise: exercises.chinUps,
    setType: { operator: 'exactly', value: 6, field: 'reps' },
    sets: [
      { weight: 15, reps: 6 },
      { weight: 15, reps: 6 },
      { weight: 15, reps: 6 },
    ],
  }),
]

const bodyweights = [
  new Bodyweight(70, 'official', dayjs('2022-09-26')),
  new Bodyweight(73, 'unofficial', dayjs('2022-09-26')),
  new Bodyweight(68, 'official', dayjs('2022-09-24')),
  new Bodyweight(67, 'official', dayjs('2022-09-23')),
  new Bodyweight(65, 'official', dayjs('2022-09-20')),
  new Bodyweight(60, 'official', dayjs('2022-09-14')),
]

/** maps over all records and creates the appropriate session logs */
const createSessionLogs = () => {
  const sessionMap = records.reduce<{ [date: string]: string[] }>(
    (map, record) => ({
      ...map,
      [record.date]: [...(map[record.date] ?? []), record._id],
    }),
    {}
  )

  return Object.entries(sessionMap).map(
    ([date, records]) => new SessionLog(date, records)
  )
}

//  START OPERATIONS

await db.dropDatabase()

await collections.modifiers.insertMany(withId(Object.values(modifiers)))
await collections.categories.insertMany(withId(Object.values(categories)))
await collections.exercises.insertMany(withId(Object.values(exercises)))
await collections.bodyweightHistory.insertMany(withId(bodyweights))
await collections.sessions.insertMany(withId(createSessionLogs()))
await collections.records.insertMany(withId(records))

await client.close()

console.log('Finished generating Dev DB. Exiting...')
