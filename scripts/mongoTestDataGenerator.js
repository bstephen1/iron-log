const { randomUUID } = require('crypto')

const db = connect('mongodb://localhost:27017/test')


//todo: REALLY don't like having to redefine this here, but it doesn't seem to be able to import the .ts class
class Exercise {
    constructor(
        name,
        status = 'active',
        notes = '',
        cues = [],
        validModifiers = [],
    ) {
        this.name = name,
            this.status = status,
            this.notes = notes,
            this.cues = cues,
            this.validModifiers = validModifiers,
            this._id = randomUUID()
    }
}


function addModifier(name, status, canDelete) {
    return { name, status, canDelete }
}

function addName(name) {
    return { name }
}

function addExercise(name, status, notes, cues, validModifiers) {
    return { name, status, notes, cues, validModifiers }
}

function addSet(weight, reps, rpe) {
    return { weight, reps, rpe }
}

function addRecord(type, exerciseName, activeModifiers, validModifiers, sets) {
    return { type, exerciseName, activeModifiers, validModifiers, sets }
}

//todo: sessionType and program
function addSessions(date, records) {
    return { date, records }
}

let modifiers = [
    addModifier('belt', 'active', true),
    addModifier('band', 'archived', true),
    addModifier('pause', 'active', true),
    addModifier('unilateral', 'active', false), //add L/R rows
    addModifier('AMRAP', 'active', false), //or set type?
    addModifier('bodyweight', 'active', false), //add BW column
]


let exercises = [
    new Exercise('squats', 'active', 'Milk and squats.', ['knees out', 'chest up'], ['belt', 'band']),
    new Exercise('curls', 'active', 'curl curl curl', ['a', 'b', 'c', 'd', 'f', 'e'], ['bodyweight', 'unilateral']),
    new Exercise('zercher squat', 'archived', 'never again', ['pain'], ['AMRAP']),
]

//todo: myo, super, rep range (?), weigh-in, cardio
let setTypes = [
    addName('basic')
]

let sets1 = [
    addSet(100, 5, 8),
    addSet(110, 5, 9),
    addSet(120, 5, 10)
]

let sets2 = [
    addSet(25, 15, undefined),
    addSet(30, 12, undefined),
    addSet(30, 10, undefined)
]

let record1 = [
    addRecord('basic', 'squats', ['belt'], ['belt', 'pause'], sets1),
    addRecord('basic', 'curls', ['belt', 'AMRAP'], ['belt', 'AMRAP', 'unilateral', 'bodyweight'], sets2)
]

let sessions = [
    addSessions('2022-09-26', record1)
]

// START OPERATIONS

db.dropDatabase()

db.modifiers.insertMany(modifiers)
db.exercises.insertMany(exercises)
db.setTypes.insertMany(setTypes)
db.sessions.insertMany(sessions)

console.log('')
console.log('-----------------------------')
console.log('Script finished successfully!')
console.log('-----------------------------')
console.log('')
