import { generateId } from '../lib/util'
import Set from './Set'
import { SetType } from './SetType'

export default class Record {
  constructor(
    public date: string,
    public exercise: string,
    public type: SetType = SetType.STANDARD,
    public validModifiers: string[] = [],
    public activeModifiers: string[] = [],
    public sets: Set[] = [],
    public readonly _id: string = generateId()
  ) {}
}
