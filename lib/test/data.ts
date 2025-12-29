import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import { createRecord, type Record } from '../../models/Record'

export const testDate = '2000-01-01'
export const testExercise = createExercise('test exercise')

export const createTestRecord = (data: Partial<Record> = {}) =>
  createRecord(data.date ?? testDate, data.exerciseId ?? testExercise._id, {
    sets: [],
    ...data,
  })
