import { randomUUID } from 'crypto';
import { ExerciseStatus } from './ExerciseStatus';

export default class Exercise {
    constructor(
        public name: string,
        public status: ExerciseStatus = ExerciseStatus.ACTIVE,
        public notes: string = '',
        public cues: string[] = [],
        public validModifiers: string[] = [],
        public readonly _id: string = randomUUID(), //uuid
    ) { }
}
