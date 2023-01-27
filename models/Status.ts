/** Status for records used in SelectorBase. Originally each model had separate statuses
 *  but they all ended up using the same status values so compressed them into a single
 *  shared enum.
 */
export enum Status {
  active = 'Active',
  /** Archived records only appear in the manage screen. */
  archived = 'Archived',
}

export const StatusOrder = {
  [Status.active]: 1,
  [Status.archived]: 2,
}
