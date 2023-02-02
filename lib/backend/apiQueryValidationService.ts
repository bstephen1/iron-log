import { StatusCodes } from 'http-status-codes'
import { ApiError } from 'next/dist/server/api-utils'
import { WeighInType } from '../../models/Bodyweight'
import BodyweightQuery from '../../models/query-filters/BodyweightQuery'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import { ExerciseQueryBackend } from '../../models/query-filters/ExerciseQuery'
import ModifierQuery from '../../models/query-filters/ModifierQuery'
import { RecordQueryBackend } from '../../models/query-filters/RecordQuery'
import { Status } from '../../models/Status'
import { validDateStringRegex } from '../frontend/constants'
import { isValidId } from '../util'

export type ApiParam = string | string[] | undefined
export type ApiQuery = { [param: string]: ApiParam }

// It could be debated whether to be permissive of unsupported params.
// For now we are just ignoring them since it probably won't matter for our use case.
// See: https://softwareengineering.stackexchange.com/questions/311484/should-i-be-permissive-of-unknown-parameters

//------------------------
// buildQuery() functions
//------------------------

/** Build and validate a query to send to the db from the rest param input. */
export function buildDateRangeQuery({ limit, start, end }: ApiQuery) {
  const query = {} as DateRangeQuery

  // only add the defined params to the query
  if (limit) {
    query.limit = validateNumber(limit, 'Limit')
  }
  if (start) {
    query.start = valiDate(start)
  }
  if (end) {
    query.end = valiDate(end)
  }

  return query
}

/** Build and validate a query to send to the db from the rest param input. */
export function buildBodyweightQuery({ limit, start, end, type }: ApiQuery) {
  const query = buildDateRangeQuery({ limit, start, end }) as BodyweightQuery

  if (type) {
    if (
      !(typeof type === 'string' && ['official', 'unofficial'].includes(type))
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid weigh-in type.')
    }
    query.type = type as WeighInType
  }

  return query
}

/** Build and validate a query to send to the db from the rest param input. */
export function buildRecordQueryBackend({ exercise, date }: ApiQuery) {
  const query = {} as RecordQueryBackend

  // only add the defined params to the query
  if (exercise) {
    query['exercise.name'] = validateString(exercise, 'Exercise')
  }
  if (date) {
    query.date = valiDate(date)
  }

  return query
}

/** Build and validate a query to send to the db from the rest param input. */
export function buildExerciseQueryBackend({
  status,
  name,
  category,
}: ApiQuery) {
  const query = {} as ExerciseQueryBackend

  // only add the defined params to the query
  if (status) {
    query.status = validateStatus(status)
  }
  if (name) {
    query.name = validateName(name)
  }
  // must convert the frontend "category" to the backend "categories"
  if (category) {
    query.categories = validateStringArray(category, 'Category')
  }

  return query
}

//------------------------
// validation functions
//------------------------

export function validateId(id: ApiParam) {
  if (!(typeof id === 'string' && isValidId(id))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid id format.')
  }

  return id
}

export function buildModifierQuery({ status }: ApiQuery) {
  const query = {} as ModifierQuery

  if (status) {
    query.status = validateStatus(status)
  }

  return query
}

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
    return [param]
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
