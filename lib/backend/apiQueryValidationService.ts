import { StatusCodes } from 'http-status-codes'
import { validDateStringRegex } from '../../lib/frontend/constants'
import { isValidId } from '../../lib/util'
import { ApiError } from '../../models/ApiError'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import { MatchType } from '../../models/query-filters/MongoQuery'
import { Status } from '../../models/Status'

type ApiParam = string | string[] | undefined
// only exported for the test file
export type ApiReq<T> = { [key in keyof T]: ApiParam }

// todo: delete, move tests to zod schemas

// It could be debated whether to be permissive of unsupported params.
// For now we are just ignoring them since it probably won't matter for our use case.
// See: https://softwareengineering.stackexchange.com/questions/311484/should-i-be-permissive-of-unknown-parameters

//------------------------
// validation functions
//------------------------

// todo: zod
export function validateId(id: ApiParam) {
  if (!(typeof id === 'string' && isValidId(id))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid id format.')
  }

  return id
}

export function validateSort(sort: ApiParam) {
  if (sort !== 'oldestFirst' && sort !== 'newestFirst') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid sort format.')
  }

  return sort as DateRangeQuery['sort']
}

// todo: zod
/** validate a date */
export function valiDate(param: ApiParam) {
  if (typeof param !== 'string' || !param.match(validDateStringRegex)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Date must be formatted as YYYY-MM-DD.'
    )
  }

  return param
}

export function validateName(param: ApiParam) {
  return validateString(param, 'Name')
}

export function validateStatus(param: ApiParam) {
  if (
    !(
      typeof param === 'string' &&
      Object.values(Status).includes(param as Status)
    )
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid modifier status.')
  }

  return param as Status
}

export function validateMatchType(param: ApiParam) {
  if (
    !(
      typeof param === 'string' &&
      Object.values(MatchType).includes(param.toLocaleLowerCase() as MatchType)
    )
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid match type.')
  }

  return param.toLocaleLowerCase() as MatchType
}

//-------------------
// buildQuery() helper functions
//-------------------

function validateString(
  param: ApiParam,
  /** name of param, for error messages */ name: string
) {
  if (typeof param !== 'string') {
    throw new ApiError(StatusCodes.BAD_REQUEST, `${name} must be a string.`)
  }
  return param
}

function validateStringArray(
  param: ApiParam,
  /** name of param, for error messages */ name: string
) {
  if (typeof param === 'string') {
    // empty string represents empty array
    return param ? [param] : []
  }
  if (Array.isArray(param)) {
    return param
  }

  throw new ApiError(
    StatusCodes.BAD_REQUEST,
    `${name} must be a string or array.`
  )
}

function validateNumber(
  param: ApiParam,
  /** name of param, for error messages */ name: string
) {
  if (typeof param !== 'string' || isNaN(Number(param))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `${name} must be a number.`)
  }
  return Number(param)
}
