const { randomUUID } = require('crypto')

const db = connect('mongodb://localhost:27017/test')

// todo: look into seeing if this script can be made less fragile with denormalized values

// todo: REALLY don't like having to redefine this here, but it doesn't seem to be able to import the .ts class
class Exercise {
  constructor(
    name,
    status = 'active',
    notes = '',
    cues = [],
    categories = [],
    validModifiers = []
  ) {
    ;(this.name = name),
      (this.status = status),
      (this.notes = notes),
      (this.cues = cues),
      (this.categories = categories),
      (this.validModifiers = validModifiers),
      (this._id = randomUUID())
  }
}

function addModifier(name, status, canDelete) {
  return { name, status, canDelete }
}

function addName(name) {
  return { name }
}

function addSet(weight, reps, rpe) {
  return { weight, reps, rpe }
}

function addRecord(
  date,
  type,
  exerciseName,
  activeModifiers,
  validModifiers,
  sets,
  _id
) {
  return {
    date,
    type,
    exerciseName,
    activeModifiers,
    validModifiers,
    sets,
    _id,
  }
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
  addModifier('unilateral', 'active', false), // add L/R rows
  addModifier('AMRAP', 'active', false), // or set type?
  addModifier('bodyweight', 'active', false), // add BW column
]

let exercises = [
  new Exercise(
    'high bar squats',
    'active',
    'Milk and squats.',
    ['knees out', 'chest up'],
    ['squat'],
    ['belt', 'band']
  ),
  new Exercise(
    'curls',
    'active',
    'curl curl curl',
    ['a', 'b', 'c', 'd', 'f', 'e'],
    ['biceps'],
    ['bodyweight', 'unilateral']
  ),
  new Exercise(
    'multi grip bench press',
    'active',
    '',
    [
      'tucked, middle grip => great triceps',
      'flared, narrow grip => great chest',
    ],
    ['bench press', 'chest', 'triceps'],
    ['flared', 'tucked', 'wide', 'narrow', 'middle', 'belt', 'wraps']
  ),
  new Exercise(
    'zercher squat',
    'archived',
    'never again',
    ['pain'],
    ['squat'],
    ['AMRAP']
  ),
]

// todo: myo, super, rep range (?), weigh-in, cardio
let setTypes = [addName('standard')]

let sets1 = [addSet(100, 5, 8), addSet(110, 5, 9), addSet(120, 5, 10)]

let sets2 = [
  addSet(25, 15, undefined),
  addSet(30, 12, undefined),
  addSet(30, 10, undefined),
]

let records = [
  addRecord(
    '2022-09-26',
    'standard',
    'squats',
    ['belt'],
    ['belt', 'pause'],
    sets1,
    randomUUID()
  ),
  addRecord(
    '2022-09-26',
    'standard',
    'curls',
    ['belt', 'AMRAP'],
    ['belt', 'AMRAP', 'unilateral', 'bodyweight'],
    sets2,
    randomUUID()
  ),
]

let sessions = [
  addSessions('2022-09-26', [records[0]._id, records[1]._id], randomUUID()),
]

//  START OPERATIONS

db.dropDatabase()

db.modifiers.insertMany(modifiers)
db.categories.insertMany(categories)
db.exercises.insertMany(exercises)
db.setTypes.insertMany(setTypes)
db.sessions.insertMany(sessions)
db.records.insertMany(records)

console.log('')
console.log('-----------------------------')
console.log('Script finished successfully!')
console.log('-----------------------------')
console.log('')
