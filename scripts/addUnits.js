const db = connect('mongodb://localhost:27017/test')

function addUnit(symbol, name, dimension, factor) {
  return { symbol, name, dimension, factor }
}

const units = [
  addUnit('kg', 'kilogram', 'weight', 1),
  addUnit('lbs', 'pound', 'weight', 0.45359237),
  addUnit('m', 'meter', 'distance', 1),
  addUnit('km', 'kilometer', 'distance', 0.001),
  addUnit('ft', 'foot', 'distance', 3.28084),
  addUnit('mi', 'mile', 'distance', 0.00062137),
  addUnit('sec', 'second', 'time', 1),
  addUnit('min', 'minute', 'time', 1 / 60),
  addUnit('hr', 'hour', 'time', 1 / 3600),
  addUnit('HH:MM:SS', 'stopwatch', 'time', 1),
  addUnit('reps', 'reps', 'reps', 1),
  addUnit('rpe', 'rate of perceived exertion', 'effort', 1),
  addUnit('rir', 'reps in reserve', 'effort', 1),
]

db.units.drop()
db.units.insertMany(units)

console.log('')
console.log('-----------------------------')
console.log('Script finished successfully!')
console.log('-----------------------------')
console.log('')
