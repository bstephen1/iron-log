import { v1 as invalidUuid } from 'uuid'
import { generateId } from '../../lib/util'
import { ApiError } from '../../models/ApiError'
import { ArrayMatchType } from '../../models/query-filters/ArrayMatchType'
import { Status } from '../../models/Status'
import {
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
      expect(() => validateMatchType([ArrayMatchType.Partial])).toThrow(
        ApiError
      )
      expect(() => validateMatchType('invalid')).toThrow(ApiError)
    })

    it('returns ArrayMatchType when valid', () => {
      expect(validateMatchType(ArrayMatchType.Partial)).toBe(
        ArrayMatchType.Partial
      )
    })

    it('ignores case', () => {
      expect(validateMatchType('PaRtIaL')).toBe(ArrayMatchType.Partial)
    })
  })
})
