import { ExerciseRecord } from './ExerciseRecord';

export class Record {
    constructor(
        readonly date: string,
        public exerciseRecords: ExerciseRecord[] = []
    ) { }
}