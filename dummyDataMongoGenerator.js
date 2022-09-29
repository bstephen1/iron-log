
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

let exerciseRecord1 = [
    addExerciseRecord(exercises[0], 'straight', [modifiers[0], modifiers[2]], straightSets1),
    addExerciseRecord(exercises[1], 'straight', [], straightSets2)
]

let dayRecords = [
    addDayRecord('2022-09-26', exerciseRecord1)
]

function addName(name) {
    return { name }
}

function addExercise(name, isActive, comments, validModifiers) {
    return { name, isActive, comments, validModifiers }
}

function addStraightSetLog(weight, reps, rpe) {
    return { weight, reps, rpe }
}

function addExerciseRecord(exercise, type, modifiers, sets) {
    return { exercise, type, modifiers, sets }
}

//todo: sessionType and program
function addDayRecord(date, exerciseRecords) {
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
addToCollection(dayRecords, 'records')


