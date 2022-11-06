import { generateId } from '../lib/util'
import Exercise from './Exercise'
import Set from './Set'
import { SetType } from './SetType'

export default class Record {
  constructor(
    public date: string,
    public exercise: Exercise['name'],
    public type: SetType = SetType.STANDARD,
    public modifiers: string[] = [],
    public activeModifiers: string[] = [],
    public sets: Set[] = [],
    public readonly _id: string = generateId()
  ) {}
}
