import Set from './Set';
import { SetType } from './SetType';

export class Record {
    constructor(
        public exerciseRef?: string,
        public type?: SetType,
        public activeModifiers: string[] = [],
        public sets: Set[] = [],
    ) { }
}