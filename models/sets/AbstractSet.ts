import StraightSet from './StraightSet';

export interface AbstractSet { }

//todo: maybe make this a union type instead of abstract interface
export type Set = StraightSet | AbstractSet

export type Nullish = undefined | null