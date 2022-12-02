const { randomUUID } = require('crypto')

const db = connect('mongodb://localhost:27017/test')

// todo: look into seeing if this script can be made less fragile with denormalized values

// todo: REALLY don't like having to redefine this here, but it doesn't seem to be able to import the .ts class
class Exercise {
  constructor(
    name,
    status = 'active',
    notes = [],
    categories = [],
    modifiers = []
  ) {
    ;(this.name = name),
      (this.status = status),
      (this.notes = notes),
      (this.categories = categories),
      (this.modifiers = modifiers),
      (this._id = randomUUID())
  }
}

function addModifier(name, status, canDelete) {
  return { name, status, canDelete }
}

function addName(name) {
  return { name }
}

function addNote(value, chips) {
  return { value, chips }
}

function addSet(weight, reps, effort, distance, time) {
  return { weight, reps, effort, distance, time }
}

function addRecord(date, exercise, activeModifiers, sets, fields, _id) {
  return {
    date,
    exercise,
    activeModifiers,
    sets,
    fields,
    _id,
  }
}

function getRecordIdsForDate(date) {
  return records
    .filter((record) => record.date === date)
    .map((record) => record._id)
}

// todo: sessionType and program
function addSessions(date, records, _id) {
  return { date, records, _id }
}

let categories = [
  addName('quads'),
  addName('squat'),
  addName('side delts'),
  addName('biceps'),
  addName('hamstrings'),
  addName('bench press'),
  addName('chest'),
  addName('triceps'),
  addName('cardio'),
  addName('strongman'),
]

let modifiers = [
  addModifier('belt', 'active', true),
  addModifier('band', 'archived', true),
  addModifier('pause', 'active', true),
  addModifier('flared', 'active', true),
  addModifier('tucked', 'active', true),
  addModifier('wide', 'active', true),
  addModifier('narrow', 'active', true),
  addModifier('wraps', 'active', true),
  addModifier('middle', 'active', true),
  addModifier('barbell', 'active', true),
  addModifier('unilateral left', 'active', true),
  addModifier('unilateral right', 'active', true),
  addModifier('AMRAP', 'active', true),
  addModifier('myo', 'active', true),
  addModifier('bodyweight', 'active', false),
  // todo: rep goal / marathon
]

let exercises = [
  new Exercise(
    'high bar squats',
    'active',
    [addNote('knees up'), addNote('chest up')],
    ['squat'],
    ['belt', 'band']
  ),
  new Exercise(
    'curls',
    'active',
    [addNote('twist in', ['barbell'])],
    ['biceps'],
    ['bodyweight', 'unilateral', 'barbell']
  ),
  new Exercise(
    'multi grip bench press',
    'active',
    [
      addNote('great triceps', ['tucked', 'middle']),
      addNote('great chest', ['flared', 'narrow']),
    ],
    ['bench press', 'chest', 'triceps'],
    ['flared', 'tucked', 'wide', 'narrow', 'middle', 'belt', 'wraps']
  ),
  new Exercise(
    'zercher squat',
    'archived',
    [addNote('pain')],
    ['squat'],
    ['AMRAP']
  ),
  new Exercise('running', 'active', [], ['cardio'], []),
  new Exercise('yoke', 'active', [], ['strongman'], []),
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
    randomUUID()
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[1] },
    ['bodyweight'],
    sets2,
    ['weight', 'reps'],
    randomUUID()
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[4] },
    [],
    setsDist,
    ['time', 'distance', 'effort'],
    randomUUID()
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[4] },
    [],
    setsDist2,
    ['distance', 'time', 'effort'],
    randomUUID()
  ),
  addRecord(
    '2022-09-26',
    { ...exercises[5] },
    [],
    setsAll,
    ['weight', 'distance', 'time', 'reps', 'effort'],
    randomUUID()
  ),
]

let sessions = [
  addSessions('2022-09-26', getRecordIdsForDate('2022-09-26'), randomUUID()),
]

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
