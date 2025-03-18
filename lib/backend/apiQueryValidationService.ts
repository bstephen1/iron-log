import { StatusCodes } from 'http-status-codes'
import { Filter, ObjectId } from 'mongodb'
import { validDateStringRegex } from '../../lib/frontend/constants'
import { isValidId } from '../../lib/util'
import { Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { Modifier } from '../../models/AsyncSelectorOption/Modifier'
import { Bodyweight, WeighInType, weighInTypes } from '../../models/Bodyweight'
import BodyweightQuery from '../../models/query-filters/BodyweightQuery'
import DateRangeQuery from '../../models/query-filters/DateRangeQuery'
import { ExerciseQuery } from '../../models/query-filters/ExerciseQuery'
import ModifierQuery from '../../models/query-filters/ModifierQuery'
import {
  MatchType,
  MatchTypes,
  MongoQuery,
} from '../../models/query-filters/MongoQuery'
import { RecordQuery } from '../../models/query-filters/RecordQuery'
import { Record } from '../../models/Record'
import { Status } from '../../models/Status'
import { ApiError } from '../../models/ApiError'

type ApiParam = string | string[] | undefined
// only exported for the test file
export type ApiReq<T> = { [key in keyof T]: ApiParam }

// It could be debated whether to be permissive of unsupported params.
// For now we are just ignoring them since it probably won't matter for our use case.
// See: https://softwareengineering.stackexchange.com/questions/311484/should-i-be-permissive-of-unknown-parameters

//------------------------
// buildQuery() functions
//------------------------

/** Build and validate a query to send to the db from the rest param input. */
export function buildDateRangeQuery<T>(
  { limit, start, end, sort }: ApiReq<DateRangeQuery>,
  userId: ObjectId
): MongoQuery<T> {
  const query: DateRangeQuery = {}

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
  if (sort) {
    query.sort = validateSort(sort)
  }

  return { ...query, userId }
}

/** Build and validate a query to send to the db from the rest param input. */
export function buildBodyweightQuery(
  { limit, start, end, type, sort }: ApiReq<BodyweightQuery>,
  userId: ObjectId
): MongoQuery<Bodyweight> {
  const query: MongoQuery<Bodyweight> = buildDateRangeQuery<Bodyweight>(
    { limit, start, end, sort },
    userId
  )
  const filter: Filter<Bodyweight> = {}

  if (type) {
    if (
      !(typeof type === 'string' && weighInTypes.includes(type as WeighInType))
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid weigh-in type.')
    }
    filter.type = type as WeighInType
  }

  return { ...query, filter }
}

/** Build and validate a query to send to the db from the rest param input. */
export function buildRecordQuery(
  {
    exercise,
    date,
    modifier,
    modifierMatchType,
    setTypeMatchType = MatchType.Exact,
    // setType fields
    field,
    operator,
    value,
    min,
    max,
    // dateRange fields
    start,
    end,
    limit,
    sort,
  }: ApiReq<RecordQuery>,
  userId: ObjectId
): MongoQuery<Record> {
  const query: MongoQuery<Record> = buildDateRangeQuery<Record>(
    { start, end, limit, sort },
    userId
  )
  const filter: Filter<Record> = {}
  const matchTypes: MatchTypes<Record> = {}

  // only add the defined params to the query
  if (exercise) {
    filter['exercise.name'] = validateString(exercise, 'Exercise')
  }
  if (date) {
    filter.date = valiDate(date)
  }
  // modifier can be an empty string
  if (modifier != undefined) {
    filter.activeModifiers = validateStringArray(modifier, 'Modifier')
    if (modifierMatchType) {
      matchTypes.activeModifiers = validateMatchType(modifierMatchType)
    }
  }

  const isRange = operator === 'between'
  const isValidSetType = !!operator && !!field && (isRange ? min || max : value)

  if (setTypeMatchType === MatchType.Any || !isValidSetType) {
    return { ...query, filter, matchTypes }
  }

  if (operator) {
    filter['setType.operator'] = validateString(operator, 'Operator')
  }

  if (field) {
    // todo: validate union type, not just string
    filter['setType.field'] = validateString(field, 'Field')
  }
  // value & min/max are mutually exclusive
  if (value && !isRange) {
    filter['setType.value'] = validateNumber(value, 'Value')
  }
  if (min && isRange) {
    filter['setType.min'] = validateNumber(min, 'Min')
  }
  if (max && isRange) {
    filter['setType.max'] = validateNumber(max, 'Max')
  }

  return { ...query, filter, matchTypes }
}

/** Build and validate a query to send to the db from the rest param input. */
export function buildExerciseQuery(
  { status, name, category, categoryMatchType }: ApiReq<ExerciseQuery>,
  userId: ObjectId
): MongoQuery<Exercise> {
  const filter: Filter<Exercise> = {}
  const matchTypes: MatchTypes<Exercise> = {}

  // only add the defined params to the query
  if (status) {
    filter.status = validateStatus(status)
  }
  if (name) {
    filter.name = validateName(name)
  }
  // must convert the frontend "category" to the backend "categories"
  if (category) {
    filter.categories = validateStringArray(category, 'Category')
    if (categoryMatchType) {
      matchTypes.categories = validateMatchType(categoryMatchType)
    }
  }

  return { filter, matchTypes, userId }
}

export function buildModifierQuery(
  { status }: ApiReq<ModifierQuery>,
  userId: ObjectId
): MongoQuery<Modifier> {
  const filter: Filter<Modifier> = {}

  if (status) {
    filter.status = validateStatus(status)
  }

  return { filter, userId }
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

export function validateSort(sort: ApiParam) {
  if (sort !== 'oldestFirst' && sort !== 'newestFirst') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid sort format.')
  }

  return sort as DateRangeQuery['sort']
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
