import { v1 as invalidUuid } from 'uuid'
import { generateId } from '../../lib/util'
import { ApiError } from '../../models/ApiError'
import BodyweightQuery from '../../models/query-filters/BodyweightQuery'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import { ExerciseQuery } from '../../models/query-filters/ExerciseQuery'
import { MatchType } from '../../models/query-filters/MongoQuery'
import { RecordQuery } from '../../models/query-filters/RecordQuery'
import { Status } from '../../models/Status'
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
  describe('buildDateRangeQuery', () => {
    it('builds full query', () => {
      const apiQuery: ApiReq<DateRangeQuery> = {
        limit: '5',
        start: '2000-01-01',
        end: '2001-01-01',
        sort: 'oldestFirst',
      }
      expect(buildDateRangeQuery(apiQuery)).toMatchObject({
        ...apiQuery,
        limit: Number(apiQuery.limit),
        sort: 'oldestFirst',
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<DateRangeQuery> = {
        limit: undefined,
        start: '2000-01-01',
        end: undefined,
        sort: undefined,
      }
      expect(buildDateRangeQuery(apiQuery)).toMatchObject({
        start: apiQuery.start,
      })
    })

    it('validates limit', () => {
      // We shouldn't ever get singleton arrays from api requests.
      // This test is more to document the behavior that Number(['5']) does coerce to a number
      expect(() => buildDateRangeQuery({ limit: ['5'] })).not.toThrow()

      expect(() => buildDateRangeQuery({ limit: 'invalid' })).toThrow()
      expect(() => buildDateRangeQuery({ limit: ['5', '3'] })).toThrow()
      expect(() => buildDateRangeQuery({ limit: ['invalid'] })).toThrow()
      expect(() => buildDateRangeQuery({ limit: '3.5' })).toThrow()
    })

    it('validates dates', () => {
      expect(() => buildDateRangeQuery({ start: 'invalid' })).toThrow()
      expect(() => buildDateRangeQuery({ start: '2000-10-10-10' })).toThrow()
      expect(() => buildDateRangeQuery({ start: '20001010' })).toThrow()
      expect(() => buildDateRangeQuery({ start: '2000-13-10' })).toThrow()

      expect(() => buildDateRangeQuery({ end: 'invalid' })).toThrow()
      expect(() => buildDateRangeQuery({ end: '2000-10-10-10' })).toThrow()
      expect(() => buildDateRangeQuery({ end: '20001010' })).toThrow()
      expect(() => buildDateRangeQuery({ end: '2000-13-10' })).toThrow()
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
      expect(buildBodyweightQuery(apiQuery)).toMatchObject({
        filter: {
          type: apiQuery.type,
        },
        start: apiQuery.start,
        end: apiQuery.end,
        limit: Number(apiQuery.limit),
        sort: 'oldestFirst',
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<BodyweightQuery> = {
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
      expect(buildRecordQuery(apiQuery)).toMatchObject({
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
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        date: '2000-01-01',
        exercise: undefined,
      }
      expect(buildRecordQuery(apiQuery)).toMatchObject({
        filter: {
          date: apiQuery.date,
        },
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

    it('builds modifiers from string modifier', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        modifier: 'modifier',
      }
      expect(buildRecordQuery(apiQuery)).toMatchObject({
        filter: { activeModifiers: [apiQuery.modifier] },
      })
    })

    it('builds empty modifier array from empty string', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        modifier: '',
      }
      expect(buildRecordQuery(apiQuery)).toMatchObject({
        filter: { activeModifiers: [] },
      })
    })

    it('builds modifiers from array modifier', () => {
      const apiQuery: ApiReq<RecordQuery> = {
        modifier: ['modifier'],
      }
      expect(buildRecordQuery(apiQuery)).toMatchObject({
        filter: { activeModifiers: apiQuery.modifier },
      })
    })

    it('validates match type', () => {
      expect(() =>
        buildRecordQuery({ modifier: 'modifier', modifierMatchType: 'invalid' })
      ).toThrow(ApiError)
    })

    it('ignores matchType when modifier is empty', () => {
      expect(
        buildRecordQuery({ modifierMatchType: MatchType.Partial })
      ).toMatchObject({})
    })

    it('ignores modifier when matchType is "any"', () => {
      expect(
        buildRecordQuery({
          modifierMatchType: MatchType.Any,
          modifier: 'my mod',
        })
      ).toMatchObject({})
    })

    describe('setType', () => {
      it('validates field', () => {
        expect(() =>
          buildRecordQuery({
            field: ['invalid'],
            operator: 'exactly',
            value: '1',
          })
        ).toThrow(ApiError)
      })

      it('validates operator', () => {
        expect(() =>
          buildRecordQuery({ operator: ['invalid'], field: 'reps', value: '1' })
        ).toThrow(ApiError)
      })

      it('validates value', () => {
        expect(() =>
          buildRecordQuery({
            value: 'invalid',
            operator: 'exactly',
            field: 'reps',
          })
        ).toThrow(ApiError)
        expect(() =>
          buildRecordQuery({ value: ['5'], operator: 'exactly', field: 'reps' })
        ).toThrow(ApiError)
      })

      it('validates min', () => {
        expect(() =>
          buildRecordQuery({
            min: 'invalid',
            operator: 'between',
            field: 'reps',
          })
        ).toThrow(ApiError)
        expect(() =>
          buildRecordQuery({ min: ['5'], operator: 'between', field: 'reps' })
        ).toThrow(ApiError)
      })

      it('validates max', () => {
        expect(() =>
          buildRecordQuery({
            max: 'invalid',
            operator: 'between',
            field: 'reps',
          })
        ).toThrow(ApiError)
        expect(() =>
          buildRecordQuery({ max: ['5'], operator: 'between', field: 'reps' })
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
        expect(buildRecordQuery(apiQuery)).not.toMatchObject({
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
        expect(buildRecordQuery(apiQuery)).not.toMatchObject({
          filter: {
            'setType.value': Number(apiQuery.value),
          },
        })
      })

      it('ignores invalid setType', () => {
        expect(buildRecordQuery({ operator: 'exactly' })).not.toMatchObject({
          filter: {
            'setType.operator': 'exactly',
          },
        })
        expect(buildRecordQuery({ field: 'reps' })).not.toMatchObject({
          filter: {
            'setType.field': 'reps',
          },
        })
        expect(
          buildRecordQuery({ operator: 'exactly', field: 'reps' })
        ).not.toMatchObject({
          filter: {
            'setType.operator': 'exactly',
            'setType.field': 'reps',
          },
        })
        expect(
          buildRecordQuery({ operator: 'between', field: 'reps' })
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
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        filter: {
          status: apiQuery.status,
          name: apiQuery.name,
          categories: [apiQuery.category],
        },
        matchTypes: {
          categories: MatchType.Partial,
        },
      })
    })

    it('builds partial query', () => {
      const apiQuery: ApiReq<ExerciseQuery> = {
        status: Status.active,
        name: undefined,
        category: undefined,
      }
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        filter: { status: apiQuery.status },
      })
    })

    it('builds categories from string category', () => {
      const apiQuery: ApiReq<ExerciseQuery> = {
        category: 'category',
      }
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        filter: { categories: [apiQuery.category] },
      })
    })

    it('builds categories from array category', () => {
      const apiQuery: ApiReq<ExerciseQuery> = {
        category: ['category'],
      }
      expect(buildExerciseQuery(apiQuery)).toMatchObject({
        filter: { categories: apiQuery.category },
      })
    })

    it('validates match type', () => {
      expect(() =>
        buildExerciseQuery({
          category: 'category',
          categoryMatchType: 'invalid',
        })
      ).toThrow(ApiError)
    })

    it('ignores matchType when category is empty', () => {
      expect(
        buildExerciseQuery({ categoryMatchType: MatchType.Partial })
      ).toMatchObject({})
    })

    it('validates status', () => {
      expect(() => buildExerciseQuery({ status: 'invalid' })).toThrow(ApiError)
    })

    it('validates name', () => {
      expect(() => buildExerciseQuery({ name: ['invalid'] })).toThrow(ApiError)
    })
  })
})
