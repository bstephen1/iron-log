import { generateId } from '../lib/util'
import Exercise from './Exercise'
import StandardSet from './sets/StandardSet'
import { SetType } from './SetType'

export default class Record {
  constructor(
    public date: string,
    public exercise: Exercise | null = null,
    public type: SetType = SetType.STANDARD,
    public activeModifiers: string[] = [],
    public sets: StandardSet[] = [],
    public readonly _id: string = generateId()
  ) {}
}
