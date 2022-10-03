import { ObjectId } from 'mongodb';
import Modifier from '../Modifier';
import { AbstractSet } from '../sets/AbstractSet';
import { SetType } from '../SetType';

export class ExerciseRecord {
    constructor(
        public exerciseRef?: ObjectId,
        public type?: SetType,
        public activeModifiers: Modifier[] = [],
        public sets: AbstractSet[] = [],
    ) { }
}