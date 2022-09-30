import { AbstractSet } from './AbstractSet';

export default interface BasicSet extends AbstractSet {
    weight?: number,
    reps?: number,
    rpe?: number
}