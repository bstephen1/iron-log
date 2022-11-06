import { generateId } from '../lib/util'
import { ModifierStatus } from './ModifierStatus'

export default class Modifier {
  constructor(
    public readonly _id: string = generateId(),
    public name: string,
    public status: ModifierStatus = ModifierStatus.ACTIVE,
    public canDelete: boolean = true
  ) {}
}
