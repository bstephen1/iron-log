
let modifiers = [
    addName('belt'),
    addName('band'),
    addName('pause'),
    addName('L/R split'), //add L/R rows
    addName('AMRAP'), //or set type?
    addName('bodyweight'), //add BW column
]

let exercises = [
    addExercise('squat', true, 'good stuff', modifiers.slice(0, 3)),
    addExercise('curls', true, '', modifiers),
    addExercise('zercher squat', false, 'pain', [modifiers[0]]),
]

//todo: myo, super, rep range (?), weigh-in
let setTypes = [
    addName('straight')
]

let straightSets1 = [
    addStraightSetLog(100, 5, 8),
    addStraightSetLog(110, 5, 9),
    addStraightSetLog(120, 5, 10)
]

let straightSets2 = [
    addStraightSetLog(25, 15, undefined),
    addStraightSetLog(30, 12, undefined),
    addStraightSetLog(30, 10, undefined)
]

let exerciseLog1 = [
    addExerciseLog('squat', 'straight', ['belt', 'pause'], straightSets1),
    addExerciseLog('curls', 'straight', [], straightSets2)
]

let logs = [
    addLog('2022-09-26', exerciseLog1)
]

function addName(name) {
    return { name }
}

function addExercise(name, isActive, comments, modifiers) {
    return { name, isActive, comments, modifiers }
}

function addStraightSetLog(weight, reps, rpe) {
    return { weight, reps, rpe }
}

function addExerciseLog(name, type, modifiers, sets) {
    return { name, type, modifiers, sets }
}

//todo: sessionType and program
function addLog(date, exercises) {
    return { date, exercises }
}

function addToCollection(objects, collection) {
    objects.map(object => db[collection].insertOne(object))
}

const db = connect('mongodb://localhost:27017/test')

db.dropDatabase()

addToCollection(modifiers, 'modifiers')
addToCollection(exercises, 'exercises')
addToCollection(setTypes, 'setTypes')
addToCollection(logs, 'logs')


