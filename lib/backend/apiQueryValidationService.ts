import { StatusCodes } from 'http-status-codes'
import { ApiError } from 'next/dist/server/api-utils'
import { ModifierStatus } from '../../models/ModifierStatus'
import { BodyweightParams } from '../../models/rest/BodyweightParams'
import { validDateStringRegex } from '../frontend/constants'
import { isValidId } from '../util'

export type ApiParam = string | string[] | undefined
export type ApiQuery = { [param: string]: ApiParam }

// It could be debated whether to be permissive of unsupported params.
// For now we are just ignoring them since it probably won't matter for our use case.
// See: https://softwareengineering.stackexchange.com/questions/311484/should-i-be-permissive-of-unknown-parameters
/** Build and validate a query to send to the db from the rest param input. */
export function buildBodyweightQuery({ limit, start, end }: ApiQuery) {
  const query = {} as BodyweightParams

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

export function validateId(id: ApiParam) {
  if (!(typeof id === 'string' && isValidId(id))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid id format.')
  }

  return id
}

export function validateModifierStatus(status: ApiParam) {
  if (status && typeof status !== 'string') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Modifier status must be a string.'
    )
  }

  if (
    typeof status === 'string' &&
    !Object.values(ModifierStatus).includes(status as ModifierStatus)
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid modifier status.')
  }

  return status as ModifierStatus | undefined
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

export function validateString(
  param: ApiParam,
  /** name of param, for error messages */ name: string
) {
  if (typeof param !== 'string') {
    throw new ApiError(StatusCodes.BAD_REQUEST, `${name} must be a string.`)
  }
  return param
}

export function validateNumber(
  param: ApiParam,
  /** name of param, for error messages */ name: string
) {
  if (typeof param !== 'string' || isNaN(Number(param))) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `${name} must be a number.`)
  }
  return Number(param)
}
