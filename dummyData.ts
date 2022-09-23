import Exercise from './models/Exercise';
import Modifier from './models/Modifier';
import SetType from './models/SetType';

export let dummyModifiers: Modifier[] = [
    addModifier('belt'),
    addModifier('band'),
    addModifier('pause'),
    addModifier('L/R split'),
]

export let dummyExercises: Exercise[] = [
    addExercise('squat', true, 'good stuff', dummyModifiers.slice(0, 3)),
    addExercise('curls', true, '', dummyModifiers),
    addExercise('zercher squat', false, 'pain', [dummyModifiers[0]]),
]

export let dummySetTypes: SetType[] = [
    addSetType('straight'),
]


function addModifier(name: string): Modifier {
    return { name }
}

function addExercise(name: string, active: boolean, comments: string, modifiers: Modifier[]): Exercise {
    return { name, active, comments, modifiers }
}

function addSetType(name: string): SetType {
    return { name }
}