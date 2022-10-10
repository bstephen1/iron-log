
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

let basicSets1 = [
    addBasicSetRecord(100, 5, 8),
    addBasicSetRecord(110, 5, 9),
    addBasicSetRecord(120, 5, 10)
]

let basicSets2 = [
    addBasicSetRecord(25, 15, undefined),
    addBasicSetRecord(30, 12, undefined),
    addBasicSetRecord(30, 10, undefined)
]

let record1 = [
    addExerciseRecord('basic', ['belt'], basicSets1),
    addExerciseRecord('basic', ['bodyweight'], basicSets2)
]

let sessions = [
    addRecord('2022-09-26', record1)
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

function addBasicSetRecord(weight, reps, rpe) {
    return { weight, reps, rpe }
}

function addExerciseRecord(type, activeModifiers, sets) {
    return { type, activeModifiers, sets }
}

//todo: sessionType and program
function addRecord(date, exerciseRecords) {
    return { date, exerciseRecords }
}

function addToCollection(objects, collection) {
    objects.map(object => db[collection].insertOne(object))
}

// START OPERATIONS

db.dropDatabase()

addToCollection(modifiers, 'modifiers')
addToCollection(exercises, 'exercises')
addToCollection(setTypes, 'setTypes')
addToCollection(sessions, 'sessions')


