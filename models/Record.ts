import { generateId } from '../lib/util'
import { DisplayFields } from './DisplayFields'
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
    /** overrides defaultDisplayFields from the Exercise. Currently no way to edit this in the UI. */
    public displayFields?: DisplayFields,
    public readonly _id: string = generateId()
  ) {}
}
