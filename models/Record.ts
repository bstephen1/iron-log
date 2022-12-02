import { generateId } from '../lib/util'
import Exercise from './Exercise'
import Set from './Set'

export default class Record {
  constructor(
    public date: string,
    public exercise: Exercise | null = null,
    public activeModifiers: string[] = [],
    public fields: (keyof Set)[] = ['weight', 'reps', 'effort'],
    public sets: Set[] = [],
    public readonly _id: string = generateId()
  ) {}
}
