const { randomUUID } = require('crypto')

const db = connect('mongodb://localhost:27017/test')

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

function addRecord(type, exerciseName, activeModifiers, validModifiers, sets) {
  return { type, exerciseName, activeModifiers, validModifiers, sets }
}

// todo: sessionType and program
function addSessions(date, records) {
  return { date, records }
}

let categories = [
  addName('quads'),
  addName('squat'),
  addName('side delts'),
  addName('biceps'),
  addName('hamstrings'),
]

let modifiers = [
  addModifier('belt', 'active', true),
  addModifier('band', 'archived', true),
  addModifier('pause', 'active', true),
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
let setTypes = [addName('basic')]

let sets1 = [addSet(100, 5, 8), addSet(110, 5, 9), addSet(120, 5, 10)]

let sets2 = [
  addSet(25, 15, undefined),
  addSet(30, 12, undefined),
  addSet(30, 10, undefined),
]

let record1 = [
  addRecord('basic', 'squats', ['belt'], ['belt', 'pause'], sets1),
  addRecord(
    'basic',
    'curls',
    ['belt', 'AMRAP'],
    ['belt', 'AMRAP', 'unilateral', 'bodyweight'],
    sets2
  ),
]

let sessions = [addSessions('2022-09-26', record1)]

//  START OPERATIONS

db.dropDatabase()

db.modifiers.insertMany(modifiers)
db.categories.insertMany(categories)
db.exercises.insertMany(exercises)
db.setTypes.insertMany(setTypes)
db.sessions.insertMany(sessions)

console.log('')
console.log('-----------------------------')
console.log('Script finished successfully!')
console.log('-----------------------------')
console.log('')
