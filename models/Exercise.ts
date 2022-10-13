import { ObjectId } from 'mongodb';
import { ExerciseStatus } from './ExerciseStatus';

export default interface Exercise {
    _id: ObjectId, //this is seen as a string after JSONifying
    name: string,
    status: ExerciseStatus,
    cues: string[],
    validModifiers: { name: string }[],
}