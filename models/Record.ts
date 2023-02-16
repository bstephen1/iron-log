import { generateId } from '../lib/util'
import Exercise from './Exercise'
import Note from './Note'
import { Set } from './Set'

// todo: add activeCategory (for programming)
export default class Record {
  constructor(
    public date: string,
    public exercise: Exercise | null = null,
    public activeModifiers: string[] = [],
    public category: string | null = '',
    public notes: Note[] = [],
    public sets: Set[] = [],
    public readonly _id: string = generateId()
  ) {}
}
