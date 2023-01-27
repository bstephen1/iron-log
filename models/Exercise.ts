import Note from './Note'
import { SelectorBaseOption } from './SelectorBaseOption'
import { Status } from './Status'

// todo: add activeCategory (for programming)
export default class Exercise extends SelectorBaseOption {
  constructor(
    public name: string,
    public status: Status = Status.active,
    public notes: Note[] = [],
    public categories: string[] = [],
    public modifiers: string[] = []
  ) {
    super(name, status)
  }
}
