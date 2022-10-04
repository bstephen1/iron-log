import { AbstractSet } from '../sets/AbstractSet';
import { SetType } from '../SetType';

export class ExerciseRecord {
    constructor(
        public exerciseRef?: string,
        public type?: SetType,
        public activeModifierRefs: string[] = [],
        public sets: AbstractSet[] = [],
    ) { }
}