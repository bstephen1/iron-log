import { ExerciseRecord } from './ExerciseRecord';

export class DayRecord {
    constructor(
        readonly date: string,
        public exerciseRecords: ExerciseRecord[] = []
    ) { }
}