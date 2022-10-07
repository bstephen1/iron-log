import { ExerciseStatus } from './ExerciseStatus';

export default interface Exercise {
    id: string,
    name: string,
    status: ExerciseStatus,
    cues?: string,
    validModifierRefs?: string[], //todo -- return from db
}