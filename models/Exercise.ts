import { ExerciseStatus } from './ExerciseStatus';

export default class Exercise {
    constructor(
        public name: string,
        //todo: this is required, but we also can't generate it for a new Exercise made on the front end
        public readonly _id?: String, //this gets stripped to a string after JSONifying
        public status: ExerciseStatus = ExerciseStatus.ACTIVE,
        public notes: string = '',
        public cues: string[] = [],
        public validModifiers: string[] = [],
    ) {

    }
}
