import { ObjectId } from 'mongodb'
import { ApiError } from 'next/dist/server/api-utils'
import { v1 as invalidUuid } from 'uuid'
import { ArrayMatchType } from '../../models/query-filters/MongoQuery'
import { Status } from '../../models/Status'
import { generateId } from '../util'
import {
  ApiQuery,
  buildBodyweightQuery,
  buildDateRangeQuery,
  buildExerciseQuery,
  buildRecordQuery,
  valiDate,
  validateId,
  validateMatchType,
  validateName,
  validateStatus,
} from './apiQueryValidationService'

// If this file is causing a TextEncoder error, try this fix:
// https://stackoverflow.com/a/74377819
// there is a compatibility issue between a mongo dep and jest and
// unfortunately it seems the only solution is to modify the node_modules file.

describe('validation', () => {
  describe('validateId', () => {
    it('throws error when not a string', () => {
      expect(() => validateId(undefined)).toThrow(ApiError)
      expect(() => validateId([generateId()])).toThrow(ApiError)
    })

    it('throws error when id format is invalid', () => {
      expect(() => validateId('invalid')).toThrow(ApiError)
      expect(() => validateId(invalidUuid())).toThrow(ApiError)
    })

    it('returns id when valid', () => {
      const id = generateId()
      expect(validateId(id)).toBe(id)
    })
  })

  describe('valiDate', () => {
    it('throws error when not a string', () => {
      expect(() => valiDate(undefined)).toThrow(ApiError)
      expect(() => valiDate(['2000-01-01'])).toThrow(ApiError)
    })

    it('throws error when date format is invalid', () => {
      expect(() => valiDate('invalid')).toThrow(ApiError)
      expect(() => valiDate('yyyy-mm-dd')).toThrow(ApiError)
      expect(() => valiDate('12345-123-123')).toThrow(ApiError)
    })

    it('returns date when valid', () => {
      const date = '2000-01-01'
      expect(valiDate(date)).toBe(date)
    })
  })

  describe('validateName', () => {
    it('throws error when not a string', () => {
      expect(() => validateName(undefined)).toThrow(ApiError)
      expect(() => validateName(['name'])).toThrow(ApiError)
    })

    it('returns name when valid', () => {
      const name = 'name'
      expect(validateName(name)).toBe(name)
    })
  })

  describe('validateStatus', () => {
    it('throws error when not a status', () => {
      expect(() => validateStatus(undefined)).toThrow(ApiError)
      expect(() => validateStatus([Status.active])).toThrow(ApiError)
      expect(() => validateStatus('invalid')).toThrow(ApiError)
    })

    it('returns status when valid', () => {
      expect(validateStatus(Status.active)).toBe(Status.active)
    })
  })

  describe('validateMatchType', () => {
    it('throws error when not a MatchType', () => {
      expect(() => validateMatchType(undefined)).toThrow(ApiError)
      expect(() => validateMatchType([ArrayMatchType.All])).toThrow(ApiError)
      expect(() => validateMatchType('invalid')).toThrow(ApiError)
    })

    it('returns ArrayMatchType when valid', () => {
      expect(validateMatchType(ArrayMatchType.All)).toBe(ArrayMatchType.All)
    })
  })
})

describe('build query', () => {
  const userId = new ObjectId('123456789ABC')

  describe('buildDateRangeQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiQuery = {
        limit: '5',
        start: '2000-01-01',
        end: '2001-01-01',
      }
      expect(buildDateRangeQuery(apiQuery)).toMatchObject({
        ...apiQuery,
        limit: Number(apiQuery.limit),
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiQuery = {
        limit: undefined,
        start: '2000-01-01',
        end: undefined,
      }
      expect(buildDateRangeQuery(apiQuery)).toMatchObject({
        start: apiQuery.start,
      })
    })

    it('validates limit', () => {
      expect(() => buildDateRangeQuery({ limit: 'invalid' })).toThrow(ApiError)
      expect(() => buildDateRangeQuery({ limit: ['5'] })).toThrow(ApiError)
    })

    it('validates dates', () => {
      expect(() => buildDateRangeQuery({ start: 'invalid' })).toThrow(ApiError)
      expect(() => buildDateRangeQuery({ end: 'invalid' })).toThrow(ApiError)
    })
  })

  describe('buildBodyweightQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiQuery = {
        type: 'official',
        limit: '5',
        start: '2000-01-01',
        end: '2001-01-01',
      }
      expect(buildBodyweightQuery(apiQuery)).toMatchObject({
        ...apiQuery,
        limit: Number(apiQuery.limit),
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiQuery = {
        type: undefined,
        limit: undefined,
        start: '2000-01-01',
        end: undefined,
      }
      expect(buildBodyweightQuery(apiQuery)).toMatchObject({
        start: apiQuery.start,
      })
    })

    it('validates type', () => {
      expect(() => buildBodyweightQuery({ type: 'invalid' })).toThrow(ApiError)
      expect(() => buildBodyweightQuery({ type: ['official'] })).toThrow(
        ApiError
      )
    })

    it('validates dateRange params', () => {
      expect(() => buildBodyweightQuery({ start: 'invalid' })).toThrow(ApiError)
      expect(() => buildBodyweightQuery({ end: 'invalid' })).toThrow(ApiError)
      expect(() => buildBodyweightQuery({ limit: 'invalid' })).toThrow(ApiError)
    })
  })

  describe('buildRecordQueryBackend', () => {
    it('builds full query', () => {
      const apiQuery: ApiQuery = { exercise: 'exercise', date: '2000-01-01' }
      expect(buildRecordQuery(apiQuery)).toMatchObject({
        date: apiQuery.date,
        'exercise.name': apiQuery.exercise,
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiQuery = { date: '2000-01-01', exercise: undefined }
      expect(buildRecordQuery(apiQuery)).toMatchObject({
        date: apiQuery.date,
      })
    })

    it('validates exercise', () => {
      expect(() => buildRecordQuery({ exercise: ['invalid'] })).toThrow(
        ApiError
      )
    })

    it('validates date', () => {
      expect(() => buildRecordQuery({ date: 'invalid' })).toThrow(ApiError)
    })
  })

  describe('buildExerciseQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiQuery = {
        status: Status.active,
        name: 'name',
        category: 'category',
        categoryMatchType: ArrayMatchType.All,
      }
      expect(buildExerciseQuery(apiQuery, userId)).toMatchObject({
        filter: {
          status: apiQuery.status,
          name: apiQuery.name,
          categories: [apiQuery.category],
        },
        matchTypes: {
          categories: ArrayMatchType.All,
        },
        userId,
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiQuery = {
        status: Status.active,
        name: undefined,
        category: undefined,
      }
      expect(buildExerciseQuery(apiQuery, userId)).toMatchObject({
        filter: { status: apiQuery.status },
        userId,
      })
    })

    it('builds categories from string category', () => {
      const apiQuery: ApiQuery = {
        category: 'category',
      }
      expect(buildExerciseQuery(apiQuery, userId)).toMatchObject({
        filter: { categories: [apiQuery.category] },
        userId,
      })
    })

    it('builds categories from array category', () => {
      const apiQuery: ApiQuery = {
        category: ['category'],
      }
      expect(buildExerciseQuery(apiQuery, userId)).toMatchObject({
        filter: { categories: apiQuery.category },
        userId,
      })
    })

    it('validates match type', () => {
      expect(() =>
        buildExerciseQuery(
          { category: 'category', categoryMatchType: 'invalid' },
          userId
        )
      ).toThrow(ApiError)
    })

    it('ignores matchType when category is empty', () => {
      expect(
        buildExerciseQuery({ categoryMatchType: ArrayMatchType.All }, userId)
      ).toMatchObject({ userId })
    })

    it('validates status', () => {
      expect(() => buildExerciseQuery({ status: 'invalid' }, userId)).toThrow(
        ApiError
      )
    })

    it('validates name', () => {
      expect(() => buildExerciseQuery({ name: ['invalid'] }, userId)).toThrow(
        ApiError
      )
    })
  })
})
