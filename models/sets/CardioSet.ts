export default interface CardioSet {
  time: number
  distance?: number
  hrZone?: number
  bodyweight?: number
  // is this useful? Tracking estimates vs exact values
  fuzzy?: { time?: boolean; distance?: boolean; bodyweight?: boolean }
}
