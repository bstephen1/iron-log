import { StatusCodes } from 'http-status-codes'
import { ApiError } from 'next/dist/server/api-utils'
import { ModifierStatus } from '../../models/ModifierStatus'
import { validDateStringRegex } from '../frontend/constants'

export type ApiQuery = string | string[] | undefined

export function validateModifierStatus(status: ApiQuery) {
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
export function valiDate(date: ApiQuery) {
  if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Date must be formatted as YYYY-MM-DD.'
    )
  }

  return date
}

export function validateName(name: ApiQuery) {
  if (!name || typeof name !== 'string') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Name must be a string.')
  }
  return name
}
