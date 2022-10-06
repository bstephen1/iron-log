
const db = connect('mongodb://localhost:27017/test')

let exIds = {
    squats: new ObjectId(),
    curls: new ObjectId(),
    zercher: new ObjectId(),
}

let mIds = {
    belt: new ObjectId(),
    band: new ObjectId(),
    pause: new ObjectId(),
    lr: new ObjectId(),
    amrap: new ObjectId(),
    bw: new ObjectId(),
}

let modifiers = [
    addModifier(mIds.belt, 'belt', true, true),
    addModifier(mIds.band, 'band', false, true),
    addModifier(mIds.pause, 'pause', true, true),
    addModifier(mIds.lr, 'L/R split', true, false), //add L/R rows
    addModifier(mIds.amrap, 'AMRAP', true, false), //or set type?
    addModifier(mIds.bw, 'bodyweight', true, false), //add BW column
]


let exercises = [
    addExercise(exIds.squats, 'squats', true, 'good stuff', [mIds.belt, mIds.band]),
    addExercise(exIds.curls, 'curls', true, '', Object.values(mIds)),
    addExercise(exIds.zercher, 'zercher squat', false, 'pain', [mIds.pause]),
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
    addExerciseRecord(exIds.squats, 'basic', [mIds.belt], basicSets1),
    addExerciseRecord(exIds.curls, 'basic', [mIds.bw], basicSets2)
]

let records = [
    addRecord('2022-09-26', exerciseRecord1)
]

function addModifier(_id, name, isActive, canDelete) {
    return { _id, name, isActive, canDelete }
}

function addName(name) {
    return { name }
}

function addExercise(_id, name, isActive, comments, validModifierRefs) {
    return { _id, name, isActive, comments, validModifierRefs }
}

function addBasicSetRecord(weight, reps, rpe) {
    return { weight, reps, rpe }
}

function addExerciseRecord(exerciseRef, type, activeModifierRefs, sets) {
    return { exerciseRef, type, activeModifierRefs, sets }
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


