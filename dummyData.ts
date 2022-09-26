import Exercise from './models/Exercise';
import Modifier from './models/Modifier';
import { SetType } from './models/SetType';

export let dummyModifiers: Modifier[] = [
    addModifier('belt'),
    addModifier('band'),
    addModifier('pause'),
    addModifier('L/R split'), //add L/R rows
    addModifier('AMRAP'), //or set type?
    addModifier('bodyweight'), //add BW column
]

export let dummyExercises: Exercise[] = [
    addExercise('squat', true, 'good stuff', dummyModifiers.slice(0, 3)),
    addExercise('curls', true, '', dummyModifiers),
    addExercise('zercher squat', false, 'pain', [dummyModifiers[0]]),
]

//todo: myo, super, rep range (?), weigh-in
export let dummySetTypes: SetType[] = [
    SetType.STRAIGHT,
]


function addModifier(name: string): Modifier {
    return { name }
}

function addExercise(name: string, active: boolean, comments: string, modifiers: Modifier[]): Exercise {
    return { name, active, comments, modifiers }
}
