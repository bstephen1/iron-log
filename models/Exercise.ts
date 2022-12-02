import { v4 as uuid } from 'uuid'
import { ExerciseStatus } from './ExerciseStatus'
import { NamedObject } from './NamedObject'
import Note from './Note'

// todo: add activeCategory (for programming)
export default class Exercise extends NamedObject {
  constructor(
    public name: string,
    public status: ExerciseStatus = ExerciseStatus.ACTIVE,
    public notes: Note[] = [],
    public categories: string[] = [],
    public modifiers: string[] = [],
    public readonly _id: string = uuid()
  ) {
    super(name, _id)
  }
}
