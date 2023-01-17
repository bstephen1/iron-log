import { ExerciseStatus } from './ExerciseStatus'
import { NamedObject } from './NamedObject'
import Note from './Note'

// todo: add activeCategory (for programming)
export default class Exercise extends NamedObject {
  constructor(
    public name: string,
    public readonly userId: string,
    public status: ExerciseStatus = ExerciseStatus.ACTIVE,
    public notes: Note[] = [],
    public categories: string[] = [],
    public modifiers: string[] = []
  ) {
    super(name, userId)
  }
}
