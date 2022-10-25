export enum ModifierStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

// could store the status as an int and translate to a string on the frontend
// that would make it harder to update sort order later though...
export const ModifierStatusOrder = {
  [ModifierStatus.ACTIVE]: 1,
  [ModifierStatus.ARCHIVED]: 2,
}
