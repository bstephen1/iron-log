import { MongoClient, ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { describe } from 'node:test'
import { beforeEach, expect, it, vi } from 'vitest'
import { createRecord } from '../../models/Record'
import { devUserId } from '../frontend/constants'
import { db } from './mongoConnect'
import {
  addRecord,
  deleteRecord,
  fetchRecord,
  fetchSessionLog,
} from './mongoService'

vi.unmock('./mongoService')
// the docs have an afterAll closing the connection but that
// breaks the tests and they run fine without it
vi.mock('./mongoConnect', async () => {
  const server = await MongoMemoryServer.create()
  const clientPromise = MongoClient.connect(server.getUri(), {})
  const client = await clientPromise
  const db = client.db('mock')
  return { client, db, clientPromise }
})
vi.mock('lib/backend/auth', () => ({
  getUserId: () => new ObjectId(devUserId),
}))

const testDate = '2000-01-01'

beforeEach(() => {
  db.dropDatabase()
})

describe('record', () => {
  it('adds to session on addRecord', async () => {
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

  it('removes from session on deleteRecord', async () => {
    const record1 = await addRecord(createRecord(testDate))
    const record2 = await addRecord(createRecord(testDate))
    const record3 = await addRecord(createRecord(testDate))

    await deleteRecord(record2._id)

    expect(await fetchSessionLog(testDate)).toMatchObject({
      records: [record1._id, record3._id],
    })
  })
})
