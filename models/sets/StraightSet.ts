import { AbstractSet } from './AbstractSet';

export default interface StraightSet extends AbstractSet {
    weight?: number,
    reps?: number,
    rpe?: number
}