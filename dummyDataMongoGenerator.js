
const db = connect('mongodb://localhost:27017/test')

let modifiers = [
    addName('belt'),
    addName('band'),
    addName('pause'),
    addName('L/R split'), //add L/R rows
    addName('AMRAP'), //or set type?
    addName('bodyweight'), //add BW column
]

let ids = {
    squats: new ObjectId(),
    curls: new ObjectId(),
    zercher: new ObjectId(),
}

let exercises = [
    addExercise(ids.squats, 'squats', true, 'good stuff', modifiers.slice(0, 3)),
    addExercise(ids.curls, 'curls', true, '', modifiers),
    addExercise(ids.zercher, 'zercher squat', false, 'pain', [modifiers[0]]),
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

let exerciseRecord1 = [
    addExerciseRecord(ids.squats, 'basic', [modifiers[0], modifiers[2]], basicSets1),
    addExerciseRecord(ids.curls, 'basic', [], basicSets2)
]

let records = [
    addRecord('2022-09-26', exerciseRecord1)
]

function addName(name) {
    return { name }
}

function addExercise(_id, name, isActive, comments, validModifiers) {
    return { _id, name, isActive, comments, validModifiers }
}

function addBasicSetRecord(weight, reps, rpe) {
    return { weight, reps, rpe }
}

function addExerciseRecord(exerciseRef, type, activeModifiers, sets) {
    return { exerciseRef, type, activeModifiers, sets }
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
addToCollection(records, 'records')


