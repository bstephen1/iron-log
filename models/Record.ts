import { generateId } from '../lib/util'
import Set from './Set'
import { SetType } from './SetType'

export class Record {
  constructor(
    public readonly _id: string = generateId(),
    public exerciseName?: string,
    public type?: SetType,
    public validModifiers: string[] = [],
    public activeModifiers: string[] = [],
    public sets: Set[] = []
  ) {}
}
