export default interface CardioSet {
  time: number
  distance?: number
  hrZone?: number
  bodyweight?: number
  // is this useful? Tracking estimates vs exact values
  fuzzy?: { time?: boolean; distance?: boolean; bodyweight?: boolean }
}

// todo: thinking this can be merged into StandardSet. StandardSet may be able to handle all sets, with orchestration from parent Record.
