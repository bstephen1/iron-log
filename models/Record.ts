import { generateId } from '../lib/util'
import Exercise from './Exercise'
import Set, { SetFields } from './Set'
import { SetType } from './SetType'

export default class Record {
  constructor(
    public date: string,
    public exercise: Exercise | null = null,
    public type: SetType = SetType.STANDARD,
    public activeModifiers: string[] = [],
    public fields: (keyof SetFields)[] = ['weight', 'reps', 'effort'],
    public sets: Set[] = [],
    public readonly _id: string = generateId()
  ) {}
}
