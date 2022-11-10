import { v4 as uuid } from 'uuid'
import { ExerciseStatus } from './ExerciseStatus'
import NamedObject from './NamedObject'

export default class Exercise extends NamedObject {
  constructor(
    public name: string,
    public status: ExerciseStatus = ExerciseStatus.ACTIVE,
    public notes: string = '',
    public cues: string[] = [],
    public categories: string[] = [],
    public modifiers: string[] = [],
    public readonly _id: string = uuid()
  ) {
    super(name, _id)
  }
}
