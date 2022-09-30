
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

let exerciseRecord1 = [
    addExerciseRecord(exercises[0], 'basic', [modifiers[0], modifiers[2]], basicSets1),
    addExerciseRecord(exercises[1], 'basic', [], basicSets2)
]

let records = [
    addRecord('2022-09-26', exerciseRecord1)
]

function addName(name) {
    return { name }
}

function addExercise(name, isActive, comments, validModifiers) {
    return { name, isActive, comments, validModifiers }
}

function addBasicSetRecord(weight, reps, rpe) {
    return { weight, reps, rpe }
}

function addExerciseRecord(exercise, type, modifiers, sets) {
    return { exercise, type, modifiers, sets }
}

//todo: sessionType and program
function addRecord(date, exerciseRecords) {
    return { date, exerciseRecords }
}

function addToCollection(objects, collection) {
    objects.map(object => db[collection].insertOne(object))
}

const db = connect('mongodb://localhost:27017/test')

db.dropDatabase()

addToCollection(modifiers, 'modifiers')
addToCollection(exercises, 'exercises')
addToCollection(setTypes, 'setTypes')
addToCollection(records, 'records')


