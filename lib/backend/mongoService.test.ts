import { MongoClient, ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import { createModifier } from '../../models/AsyncSelectorOption/Modifier'
import { createRecord } from '../../models/Record'
import { createSessionLog } from '../../models/SessionLog'
import { getUserId } from './auth'
import { db } from './mongoConnect'
import {
  addCategory,
  addExercise,
  addModifier,
  addRecord,
  deleteCategory,
  deleteExercise,
  deleteModifier,
  deleteRecord,
  fetchBodyweights,
  fetchCategories,
  fetchExercise,
  fetchExercises,
  fetchModifiers,
  fetchRecord,
  fetchRecords,
  fetchSessionLog,
  fetchSessionLogs,
  updateCategoryFields,
  updateExerciseFields,
  updateModifierFields,
  updateRecordFields,
  upsertBodyweight,
  upsertSessionLog,
} from './mongoService'
import { createNote } from '../../models/Note'
import { createCategory } from '../../models/AsyncSelectorOption/Category'
import { createBodyweight } from '../../models/Bodyweight'

vi.unmock('./mongoService')
// the docs have an afterAll closing the connection but that
// breaks the tests and they run fine without it
vi.mock('./mongoConnect', async () => {
  const server = await MongoMemoryServer.create()
  const clientPromise = MongoClient.connect(server.getUri(), {})
  const client = await clientPromise
  const db = client.db()
  return { client, db, clientPromise }
})

const testDate = '2000-01-01'
const testDateNew = '2000-02-02'

beforeEach(async () => {
  await db.dropDatabase()
})

describe('SessionLog', () => {
  it('fetches session logs for given user only', async () => {
    await addRecord(createRecord(testDate))
    await upsertSessionLog(createSessionLog(testDateNew))

    vi.mocked(getUserId).mockResolvedValueOnce(new ObjectId())
    await upsertSessionLog(createSessionLog('2020-02-02'))

    expect(await fetchSessionLogs({ start: testDate })).toHaveLength(2)
  })
})

describe('Record', () => {
  it('excludes userId', async () => {
    const record = createRecord(testDate)
    await addRecord(record)

    expect(await fetchRecord(record._id)).not.toMatchObject({
      userId: expect.any(String),
    })
  })

  it('adds record and adds to session', async () => {
    const record = createRecord(testDate)
    await addRecord(record)

    // creates session
    expect(await fetchRecord(record._id)).toBeTruthy()
    expect(await fetchSessionLog(record.date)).toMatchObject({
      records: [record._id],
    })

    const record2 = createRecord(testDate)
    await addRecord(record2)

    // updates existing session
    expect(await fetchSessionLog(record.date)).toMatchObject({
      records: [record._id, record2._id],
    })
  })

  it('deletes record and removes from session', async () => {
    const record1 = await addRecord(createRecord(testDate))
    const record2 = await addRecord(createRecord(testDate))
    const record3 = await addRecord(createRecord(testDate))

    await deleteRecord(record2._id)

    expect(await fetchSessionLog(testDate)).toMatchObject({
      records: [record1._id, record3._id],
    })
  })

  it('fetches filtered records', async () => {
    const modifier = await addModifier(createModifier('belt'))
    const exercise = await addExercise(
      createExercise('squats', { modifiers: [modifier.name] })
    )
    await addRecord(
      createRecord(testDate, { exercise, activeModifiers: [modifier.name] })
    )
    await addRecord(createRecord(testDate, { exercise }))
    await addRecord(createRecord(testDate))

    expect(await fetchRecords({ 'exercise.name': exercise.name })).toHaveLength(
      2
    )
    expect(await fetchRecords({ activeModifiers: modifier.name })).toHaveLength(
      1
    )
  })

  it('preserves active modifiers removed from an exercise', async () => {
    const modifier = await addModifier(createModifier('belt'))
    const exercise = await addExercise(
      createExercise('squats', { modifiers: [modifier.name] })
    )
    await addRecord(
      createRecord(testDate, { exercise, activeModifiers: [modifier.name] })
    )

    // remove the modifier
    await updateExerciseFields(exercise._id, { modifiers: [] })
    expect(await fetchRecords({ activeModifiers: modifier.name })).toHaveLength(
      0
    )

    // add it back -- record should still have the modifier
    await updateExerciseFields(exercise._id, { modifiers: [modifier.name] })
    expect(await fetchRecords({ activeModifiers: modifier.name })).toHaveLength(
      1
    )
  })

  it('overrides start/end with date', async () => {
    await addRecord(createRecord(testDate))

    expect(
      await fetchRecords({ start: testDate, date: testDateNew })
    ).toHaveLength(0)
  })

  it('removes a nonexistent record from sessions after an attempted fetch', async () => {
    await upsertSessionLog(createSessionLog(testDate, ['invalid']))

    // should delete the invalid record from any sessionlogs
    await fetchRecord('invalid')

    expect(await fetchSessionLog(testDate)).toMatchObject({ records: [] })
  })

  it('returns updates record after modification', async () => {
    const record = await addRecord(createRecord(testDate))

    const updatedRecord = await updateRecordFields(record._id, {
      sets: [{ reps: 5 }],
    })
    expect(updatedRecord.sets).toHaveLength(1)
  })
})

describe('Exercise', () => {
  it('performs crud operations', async () => {
    const exercise = createExercise('deadlifts')

    await addExercise(exercise)
    expect(await fetchExercise(exercise._id)).toEqual(exercise)

    const updated = await updateExerciseFields(exercise._id, {
      name: 'updated',
    })
    expect(updated.name).toBe('updated')

    await deleteExercise(exercise._id)
    expect(await fetchExercises()).toHaveLength(0)
  })

  it('prevents deleting exercise used in a record', async () => {
    const exercise = await addExercise(createExercise('squats'))
    await addRecord(createRecord(testDate, { exercise }))

    await expect(deleteExercise(exercise._id)).rejects.toThrow()
  })
})

describe('Modifier', () => {
  it('performs crud operations', async () => {
    const modifier = createModifier('belt')

    await addModifier(modifier)
    expect(await fetchModifiers()).toHaveLength(1)

    const updated = await updateModifierFields(modifier._id, {
      name: 'updated',
    })
    expect(updated.name).toBe('updated')

    await deleteModifier(modifier._id)
    expect(await fetchModifiers()).toHaveLength(0)
  })

  it('updates exercises and records on name change', async () => {
    const modifier = await addModifier(createModifier('belt'))
    const exercise = await addExercise(
      createExercise('squats', {
        modifiers: [modifier.name],
        notes: [createNote('', [modifier.name])],
      })
    )
    const record = await addRecord(
      createRecord(testDate, {
        exercise,
        activeModifiers: [modifier.name],
      })
    )

    const updated = await updateModifierFields(modifier._id, {
      name: 'updated',
    })

    expect(await fetchExercise(exercise._id)).toMatchObject({
      modifiers: [updated.name],
      notes: [{ tags: [updated.name] }],
    })
    expect(await fetchRecord(record._id)).toMatchObject({
      activeModifiers: [updated.name],
    })
  })

  it('prevents deleting modifier used in an exercise', async () => {
    const modifier = await addModifier(createModifier('belt'))
    await addExercise(createExercise('squats', { modifiers: [modifier.name] }))

    await expect(deleteModifier(modifier._id)).rejects.toThrow()
  })
})

describe('Category', () => {
  it('performs crud operations', async () => {
    const category = createCategory('biceps')

    await addCategory(category)
    expect(await fetchCategories()).toHaveLength(1)

    const updated = await updateCategoryFields(category._id, {
      name: 'updated',
    })
    expect(updated.name).toBe('updated')

    await deleteCategory(category._id)
    expect(await fetchCategories()).toHaveLength(0)
  })

  it('updates exercises and records on name change', async () => {
    const category = await addCategory(createCategory('belt'))
    const exercise = await addExercise(
      createExercise('squats', {
        categories: [category.name],
      })
    )
    const record = await addRecord(
      createRecord(testDate, {
        exercise,
        category: category.name,
      })
    )

    const updated = await updateCategoryFields(category._id, {
      name: 'updated',
    })

    expect(await fetchExercise(exercise._id)).toMatchObject({
      categories: [updated.name],
    })
    expect(await fetchRecord(record._id)).toMatchObject({
      category: updated.name,
    })
  })

  it('prevents deleting category used in an exercise', async () => {
    const category = await addCategory(createCategory('belt'))
    await addExercise(createExercise('squats', { categories: [category.name] }))

    await expect(deleteCategory(category._id)).rejects.toThrow()
  })
})

describe('Bodyweight', () => {
  it('allows one weight of each type per day', async () => {
    await upsertBodyweight(createBodyweight(50, 'official', testDate))
    await upsertBodyweight(createBodyweight(75, 'unofficial', testDate))
    await upsertBodyweight(createBodyweight(25, 'official', testDate))

    expect(await fetchBodyweights({ start: testDate })).toHaveLength(2)
  })

  it('sorts by oldest or newest first', async () => {
    await upsertBodyweight(createBodyweight(1, 'official', '2000-01-01'))
    await upsertBodyweight(createBodyweight(2, 'official', '2000-02-02'))
    await upsertBodyweight(createBodyweight(3, 'official', '2000-03-03'))

    expect(await fetchBodyweights({ sort: 'newestFirst' })).toMatchObject([
      { value: 3 },
      { value: 2 },
      { value: 1 },
    ])
    expect(await fetchBodyweights({ sort: 'oldestFirst' })).toMatchObject([
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ])
  })
})
