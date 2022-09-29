import Exercise from '../Exercise';
import Modifier from '../Modifier';
import { AbstractSet } from '../sets/AbstractSet';
import { SetType } from '../SetType';

export class ExerciseRecord {
    constructor(
        public exercise?: Exercise,
        public type?: SetType,
        public modifiers: Modifier[] = [],
        public sets: AbstractSet[] = [],
    ) { }
}