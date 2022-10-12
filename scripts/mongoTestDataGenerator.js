
const db = connect('mongodb://localhost:27017/test')

let modifiers = [
    addModifier('belt', 'active', true),
    addModifier('band', 'archived', true),
    addModifier('pause', 'active', true),
    addModifier('L/R split', 'active', false), //add L/R rows
    addModifier('AMRAP', 'active', false), //or set type?
    addModifier('bodyweight', 'active', false), //add BW column
]


let exercises = [
    addExercise('squats', 'active', ['knees out', 'chest up'], ['belt', 'band']),
    addExercise('curls', 'active', [], ['bodyweight', 'L/R split']),
    addExercise('zercher squat', 'archived', ['pain'], ['AMRAP']),
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
    addRecord('basic', 'curls', ['belt', 'AMRAP'], ['belt', 'AMRAP', 'L/R split', 'bodyweight'], sets2)
]

let sessions = [
    addSessions('2022-09-26', record1)
]

function addModifier(name, status, canDelete) {
    return { name, status, canDelete }
}

function addName(name) {
    return { name }
}

function addExercise(name, status, cues, validModifiers) {
    return { name, status, cues, validModifiers }
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

// START OPERATIONS

db.dropDatabase()

db.modifiers.insertMany(modifiers)
db.exercises.insertMany(exercises)
db.setTypes.insertMany(setTypes)
db.sessions.insertMany(sessions)


