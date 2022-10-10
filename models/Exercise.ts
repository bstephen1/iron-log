import { ExerciseStatus } from './ExerciseStatus';

export default interface Exercise {
    id: string,
    name: string,
    status: ExerciseStatus,
    cues: string[],
    validModifiers: { name: string }[],
}