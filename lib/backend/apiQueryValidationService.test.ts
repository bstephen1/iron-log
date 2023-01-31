import { ApiError } from 'next/dist/server/api-utils'
import { v1 as invalidUuid } from 'uuid'
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
  validateName,
  validateStatus,
} from './apiQueryValidationService'

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
})

describe('build query', () => {
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

  describe('buildRecordQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiQuery = { exercise: 'exercise', date: '2000-01-01' }
      expect(buildRecordQuery(apiQuery)).toMatchObject({
        date: apiQuery.date,
        'exercise.name': apiQuery.exercise,
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiQuery = { date: '2000-01-01', exercise: undefined }
      expect(buildRecordQuery(apiQuery)).toMatchObject({ date: apiQuery.date })
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
      }
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        status: apiQuery.status,
        name: apiQuery.name,
        categories: [apiQuery.category],
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiQuery = {
        status: Status.active,
        name: undefined,
        category: undefined,
        categories: undefined,
      }
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        status: apiQuery.status,
      })
    })

    it('merges category and categories from strings', () => {
      const apiQuery: ApiQuery = {
        category: 'category',
        categories: 'categories',
      }
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        categories: [apiQuery.category, apiQuery.categories],
      })
    })

    it('merges category and categories from arrays', () => {
      const apiQuery: ApiQuery = {
        category: ['category'],
        categories: ['categories'],
      }
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        categories: ['category', 'categories'],
      })
    })

    it('validates status', () => {
      expect(() => buildExerciseQuery({ status: 'invalid' })).toThrow(ApiError)
    })

    it('validates name', () => {
      expect(() => buildExerciseQuery({ name: ['invalid'] })).toThrow(ApiError)
    })
  })
})
