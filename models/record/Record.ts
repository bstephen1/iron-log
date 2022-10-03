import { ExerciseRecord } from './ExerciseRecord';

export class Record {
    constructor(
        readonly date: string, //mongo generates an _id with timestamp, but a user may want to create a record for a different day 
        public exerciseRecords: ExerciseRecord[] = []
    ) { }
}