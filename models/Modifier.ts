import { v4 as uuid } from 'uuid'
import { ModifierStatus } from './ModifierStatus'

export default class Modifier {
  constructor(
    public name: string,
    public status: ModifierStatus = ModifierStatus.ACTIVE,
    public canDelete: boolean = true,
    public readonly _id: string = uuid()
  ) {}
}
