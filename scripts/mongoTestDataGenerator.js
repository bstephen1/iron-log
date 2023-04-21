const { randomUUID } = require('crypto')
const { ObjectId } = require('mongodb')

const db = connect('mongodb://localhost:27017/test')

// NEXT_PUBLIC_DUMMY_SESSION_ID in .env.development must match a userId to show the corresponding records
const dummyUserId = new ObjectId('1234567890AB')
const dummyUserId2 = new ObjectId('1234567890CC')

// todo: look into seeing if this script can be made less fragile with denormalized values

// todo: REALLY don't like having to redefine this here, but it doesn't seem to be able to import the .ts class
class Exercise {
  constructor(
    name,
    status = 'Active',
    notes = [],
    categories = [],
    modifiers = [],
    userId = dummyUserId,
    displayFields
  ) {
    ;(this.name = name),
      (this.userId = userId),
      (this.status = status),
      (this.notes = notes),
      (this.categories = categories),
      (this.modifiers = modifiers),
      (this.displayFields = displayFields),
      (this._id = randomUUID())
  }
}

function addModifier(name, status, canDelete, userId = dummyUserId) {
  return { name, status, canDelete, _id: randomUUID(), userId }
}

function addCategory(name, status = 'Active', userId = dummyUserId) {
  return { name, status, _id: randomUUID(), userId }
}

function addNote(value = '', tags = []) {
  return { value, tags }
}

function addSet(weight, reps, effort, distance, time) {
  return { weight, reps, effort, distance, time }
}

function addRecord(
  date,
  exercise,
  activeModifiers,
  sets,
  fields,
  notes,
  category = '',
  userId = dummyUserId
) {
  return {
    date,
    exercise,
    activeModifiers,
    sets,
    fields,
    notes,
    _id: randomUUID(),
    category,
    userId,
  }
}

function getRecordIdsForDate(date) {
  return records
    .filter((record) => record.date === date)
    .map((record) => record._id)
}

// todo: sessionType and program
function addSessions(date, records, userId = dummyUserId) {
  return { date, records, notes: [], _id: randomUUID(), userId }
}

let categories = [
  addCategory('quads'),
  addCategory('squat'),
  addCategory('side delts'),
  addCategory('biceps'),
  addCategory('hamstrings'),
  addCategory('bench press'),
  addCategory('chest'),
  addCategory('triceps'),
  addCategory('cardio'),
  addCategory('strongman'),
]

let modifiers = [
  addModifier('belt', 'Active', true),
  addModifier('band', 'Archived', true),
  addModifier('pause', 'Active', true),
  addModifier('flared', 'Active', true),
  addModifier('tucked', 'Active', true),
  addModifier('wide', 'Active', true),
  addModifier('narrow', 'Active', true),
  addModifier('wraps', 'Active', true),
  addModifier('middle', 'Active', true),
  addModifier('barbell', 'Active', true),
  addModifier('unilateral left', 'Active', true),
  addModifier('unilateral right', 'Active', true),
  addModifier('AMRAP', 'Active', true),
  addModifier('myo', 'Active', true),
  addModifier('bodyweight', 'Active', false),
  // todo: rep goal / marathon
]

let exercises = [
  new Exercise(
    'high bar squats',
    'Active',
    [addNote('knees up'), addNote('chest up')],
    ['squat'],
    ['belt', 'band']
  ),
  new Exercise(
    'curls',
    'Active',
    [addNote('twist in', ['barbell'])],
    ['biceps'],
    ['bodyweight', 'unilateral left', 'unilateral right', 'barbell']
  ),
  new Exercise(
    'multi grip bench press',
    'Active',
    [
      addNote('great triceps', ['tucked', 'middle']),
      addNote('great chest', ['flared', 'narrow']),
    ],
    ['bench press', 'chest', 'triceps'],
    ['flared', 'tucked', 'wide', 'narrow', 'middle', 'belt', 'wraps']
  ),
  new Exercise(
    'zercher squat',
    'Archived',
    [addNote('pain')],
    ['squat'],
    ['AMRAP']
  ),
  new Exercise('running', 'Active', [], ['cardio'], []),
  new Exercise('yoke', 'Active', [], ['strongman'], []),
]

let sets1 = [addSet(100, 5, 8), addSet(110, 5, 9), addSet(120, 5, 10)]

let sets2 = [
  addSet(25, 15, undefined),
  addSet(30, 12, undefined),
  addSet(30, 10, undefined),
]

let setsDist = [addSet(undefined, undefined, 9, 5000, 900)]

let setsDist2 = [
  addSet(undefined, undefined, 10, 50, 10),
  addSet(undefined, undefined, 10, 50, 9.83),
  addSet(undefined, undefined, 10, 50, 8.33),
]

let setsAll = [addSet(500, 2, 8, 50, 10)]

let records = [
  addRecord(
    '2022-09-26',
    { ...exercises[0] },
    ['belt'],
    sets1,
    ['weight', 'reps', 'effort'],
    [addNote('good lifts', ['Record'])]
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[1] },
    ['bodyweight'],
    sets2,
    ['weight', 'reps'],
    []
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[4] },
    [],
    setsDist,
    ['time', 'distance', 'effort'],
    []
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[4] },
    [],
    setsDist2,
    ['distance', 'time', 'effort'],
    []
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[5] },
    [],
    setsAll,
    ['weight', 'distance', 'time', 'reps', 'effort'],
    []
  ),
]

let sessions = [addSessions('2022-09-26', getRecordIdsForDate('2022-09-26'))]

//  START OPERATIONS

db.dropDatabase()

db.modifiers.insertMany(modifiers)
db.categories.insertMany(categories)
db.exercises.insertMany(exercises)
db.sessions.insertMany(sessions)
db.records.insertMany(records)

console.log('')
console.log('-----------------------------')
console.log('Script finished successfully!')
console.log('-----------------------------')
console.log('')
