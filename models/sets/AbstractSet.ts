import BasicSet from './BasicSet';

export interface AbstractSet { }

//todo: maybe make this a union type instead of abstract interface
export type Set = BasicSet | AbstractSet

export type Nullish = undefined | null