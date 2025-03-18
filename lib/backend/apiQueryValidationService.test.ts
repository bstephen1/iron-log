import { ObjectId } from 'mongodb'
import { v1 as invalidUuid } from 'uuid'
import { generateId } from '../../lib/util'
import BodyweightQuery from '../../models/query-filters/BodyweightQuery'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import { ExerciseQuery } from '../../models/query-filters/ExerciseQuery'
import { MatchType } from '../../models/query-filters/MongoQuery'
import { RecordQuery } from '../../models/query-filters/RecordQuery'
import { Status } from '../../models/Status'
import { devUserId } from '../frontend/constants'
import { ApiError } from '../../models/ApiError'
import {
  ApiReq,
  buildBodyweightQuery,
  buildDateRangeQuery,
  buildExerciseQuery,
  buildRecordQuery,
  valiDate,
  validateId,
  validateMatchType,
  validateName,
  validateSort,
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

  describe('validateSort', () => {
    it('throws error when not a sort type', () => {
      expect(() => validateSort(undefined)).toThrow(ApiError)
      expect(() => validateSort(['oldestFirst'])).toThrow(ApiError)
      expect(() => validateSort('invalid')).toThrow(ApiError)
    })

    it('returns sort type when valid', () => {
      expect(validateSort('oldestFirst')).toBe('oldestFirst')
      expect(validateSort('newestFirst')).toBe('newestFirst')
    })
  })

  describe('validateMatchType', () => {
    it('throws error when not a MatchType', () => {
      expect(() => validateMatchType(undefined)).toThrow(ApiError)
      expect(() => validateMatchType([MatchType.Partial])).toThrow(ApiError)
      expect(() => validateMatchType('invalid')).toThrow(ApiError)
    })

    it('returns ArrayMatchType when valid', () => {
      expect(validateMatchType(MatchType.Partial)).toBe(MatchType.Partial)
    })

    it('ignores case', () => {
      expect(validateMatchType('PaRtIaL')).toBe(MatchType.Partial)
    })
  })
})

describe('build query', () => {
  const userId = new ObjectId(devUserId)

  describe('buildDateRangeQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiReq<DateRangeQuery> = {
        limit: '5',
        start: '2000-01-01',
        end: '2001-01-01',
        sort: 'oldestFirst',
      }
      expect(buildDateRangeQuery(apiQuery, userId)).toMatchObject({
        ...apiQuery,
        limit: Number(apiQuery.limit),
        sort: 'oldestFirst',
        userId,
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<DateRangeQuery> = {
        limit: undefined,
        start: '2000-01-01',
        end: undefined,
        sort: undefined,
      }
      expect(buildDateRangeQuery(apiQuery, userId)).toMatchObject({
        start: apiQuery.start,
        userId,
      })
    })

    it('validates limit', () => {
      expect(() => buildDateRangeQuery({ limit: 'invalid' }, userId)).toThrow(
        ApiError
      )
      expect(() => buildDateRangeQuery({ limit: ['5'] }, userId)).toThrow(
        ApiError
      )
    })

    it('validates dates', () => {
      expect(() => buildDateRangeQuery({ start: 'invalid' }, userId)).toThrow(
        ApiError
      )
      expect(() => buildDateRangeQuery({ end: 'invalid' }, userId)).toThrow(
        ApiError
      )
    })
  })

  describe('buildBodyweightQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiReq<BodyweightQuery> = {
        type: 'official',
        limit: '5',
        start: '2000-01-01',
        end: '2001-01-01',
        sort: 'oldestFirst',
      }
      expect(buildBodyweightQuery(apiQuery, userId)).toMatchObject({
        filter: {
          type: apiQuery.type,
        },
        start: apiQuery.start,
        end: apiQuery.end,
        limit: Number(apiQuery.limit),
        sort: 'oldestFirst',
        userId,
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<BodyweightQuery> = {
        type: undefined,
        limit: undefined,
        start: '2000-01-01',
        end: undefined,
      }
      expect(buildBodyweightQuery(apiQuery, userId)).toMatchObject({
        start: apiQuery.start,
        userId,
      })
    })

    it('validates type', () => {
      expect(() => buildBodyweightQuery({ type: 'invalid' }, userId)).toThrow(
        ApiError
      )
      expect(() =>
        buildBodyweightQuery({ type: ['official'] }, userId)
      ).toThrow(ApiError)
    })

    it('validates dateRange params', () => {
      expect(() => buildBodyweightQuery({ start: 'invalid' }, userId)).toThrow(
        ApiError
      )
      expect(() => buildBodyweightQuery({ end: 'invalid' }, userId)).toThrow(
        ApiError
      )
      expect(() => buildBodyweightQuery({ limit: 'invalid' }, userId)).toThrow(
        ApiError
      )
    })
  })

  describe('buildRecordQuery', () => {
    it('builds full non-range query', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        exercise: 'exercise',
        date: '2000-01-01',
        modifier: 'modifier',
        modifierMatchType: MatchType.Partial,
        start: '2022-01-01',
        end: '2022-02-02',
        limit: '6',
        sort: 'oldestFirst',
        operator: 'exactly',
        field: 'reps',
        value: '5',
        min: '1',
        max: '8',
      }
      expect(buildRecordQuery(apiQuery, userId)).toMatchObject({
        filter: {
          date: apiQuery.date,
          activeModifiers: [apiQuery.modifier],
          'exercise.name': apiQuery.exercise,
          'setType.operator': apiQuery.operator,
          'setType.field': apiQuery.field,
          'setType.value': Number(apiQuery.value),
        },
        start: apiQuery.start,
        end: apiQuery.end,
        limit: Number(apiQuery.limit),
        matchTypes: {
          activeModifiers: apiQuery.modifierMatchType,
        },
        sort: 'oldestFirst',
        userId,
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        date: '2000-01-01',
        exercise: undefined,
      }
      expect(buildRecordQuery(apiQuery, userId)).toMatchObject({
        filter: {
          date: apiQuery.date,
        },
        userId,
      })
    })

    it('validates exercise', () => {
      expect(() => buildRecordQuery({ exercise: ['invalid'] }, userId)).toThrow(
        ApiError
      )
    })

    it('validates date', () => {
      expect(() => buildRecordQuery({ date: 'invalid' }, userId)).toThrow(
        ApiError
      )
    })

    it('builds modifiers from string modifier', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        modifier: 'modifier',
      }
      expect(buildRecordQuery(apiQuery, userId)).toMatchObject({
        filter: { activeModifiers: [apiQuery.modifier] },
        userId,
      })
    })

    it('builds empty modifier array from empty string', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        modifier: '',
      }
      expect(buildRecordQuery(apiQuery, userId)).toMatchObject({
        filter: { activeModifiers: [] },
        userId,
      })
    })

    it('builds modifiers from array modifier', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        modifier: ['modifier'],
      }
      expect(buildRecordQuery(apiQuery, userId)).toMatchObject({
        filter: { activeModifiers: apiQuery.modifier },
        userId,
      })
    })

    it('validates match type', () => {
      expect(() =>
        buildRecordQuery(
          { modifier: 'modifier', modifierMatchType: 'invalid' },
          userId
        )
      ).toThrow(ApiError)
    })

    it('ignores matchType when modifier is empty', () => {
      expect(
        buildRecordQuery({ modifierMatchType: MatchType.Partial }, userId)
      ).toMatchObject({ userId })
    })

    it('ignores modifier when matchType is "any"', () => {
      expect(
        buildRecordQuery(
          { modifierMatchType: MatchType.Any, modifier: 'my mod' },
          userId
        )
      ).toMatchObject({ userId })
    })

    describe('setType', () => {
      it('validates field', () => {
        expect(() =>
          buildRecordQuery(
            { field: ['invalid'], operator: 'exactly', value: '1' },
            userId
          )
        ).toThrow(ApiError)
      })

      it('validates operator', () => {
        expect(() =>
          buildRecordQuery(
            { operator: ['invalid'], field: 'reps', value: '1' },
            userId
          )
        ).toThrow(ApiError)
      })

      it('validates value', () => {
        expect(() =>
          buildRecordQuery(
            { value: 'invalid', operator: 'exactly', field: 'reps' },
            userId
          )
        ).toThrow(ApiError)
        expect(() =>
          buildRecordQuery(
            { value: ['5'], operator: 'exactly', field: 'reps' },
            userId
          )
        ).toThrow(ApiError)
      })

      it('validates min', () => {
        expect(() =>
          buildRecordQuery(
            { min: 'invalid', operator: 'between', field: 'reps' },
            userId
          )
        ).toThrow(ApiError)
        expect(() =>
          buildRecordQuery(
            { min: ['5'], operator: 'between', field: 'reps' },
            userId
          )
        ).toThrow(ApiError)
      })

      it('validates max', () => {
        expect(() =>
          buildRecordQuery(
            { max: 'invalid', operator: 'between', field: 'reps' },
            userId
          )
        ).toThrow(ApiError)
        expect(() =>
          buildRecordQuery(
            { max: ['5'], operator: 'between', field: 'reps' },
            userId
          )
        ).toThrow(ApiError)
      })

      it('ignores min/max when not using range operator', () => {
        const apiQuery: ApiReq<RecordQuery> = {
          operator: 'exactly',
          value: '5',
          min: '1',
          max: '8',
          field: 'reps',
        }
        expect(buildRecordQuery(apiQuery, userId)).not.toMatchObject({
          filter: {
            'setType.min': Number(apiQuery.min),
            'setType.max': Number(apiQuery.max),
          },
        })
      })

      it('ignores value when using range operator', () => {
        const apiQuery: ApiReq<RecordQuery> = {
          operator: 'between',
          value: '5',
          min: '1',
          max: '8',
          field: 'reps',
        }
        expect(buildRecordQuery(apiQuery, userId)).not.toMatchObject({
          filter: {
            'setType.value': Number(apiQuery.value),
          },
        })
      })

      it('ignores invalid setType', () => {
        expect(
          buildRecordQuery({ operator: 'exactly' }, userId)
        ).not.toMatchObject({
          filter: {
            'setType.operator': 'exactly',
          },
        })
        expect(buildRecordQuery({ field: 'reps' }, userId)).not.toMatchObject({
          filter: {
            'setType.field': 'reps',
          },
        })
        expect(
          buildRecordQuery({ operator: 'exactly', field: 'reps' }, userId)
        ).not.toMatchObject({
          filter: {
            'setType.operator': 'exactly',
            'setType.field': 'reps',
          },
        })
        expect(
          buildRecordQuery({ operator: 'between', field: 'reps' }, userId)
        ).not.toMatchObject({
          filter: {
            'setType.operator': 'between',
            'setType.field': 'reps',
          },
        })
      })
    })
  })

  describe('buildExerciseQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiReq<ExerciseQuery> = {
        status: Status.active,
        name: 'name',
        category: 'category',
        categoryMatchType: MatchType.Partial,
      }
      expect(buildExerciseQuery(apiQuery, userId)).toMatchObject({
        filter: {
          status: apiQuery.status,
          name: apiQuery.name,
          categories: [apiQuery.category],
        },
        matchTypes: {
          categories: MatchType.Partial,
        },
        userId,
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<ExerciseQuery> = {
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
      const apiQuery: ApiReq<ExerciseQuery> = {
        category: 'category',
      }
      expect(buildExerciseQuery(apiQuery, userId)).toMatchObject({
        filter: { categories: [apiQuery.category] },
        userId,
      })
    })

    it('builds categories from array category', () => {
      const apiQuery: ApiReq<ExerciseQuery> = {
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
        buildExerciseQuery({ categoryMatchType: MatchType.Partial }, userId)
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
