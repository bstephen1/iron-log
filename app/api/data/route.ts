import type { NextRequest } from 'next/server'
import {
  addCategory,
  addExercise,
  addModifier,
  addRecord,
} from '../../../lib/backend/mongoService'
import { isCategory } from '../../../models/AsyncSelectorOption/Category'
import { isExercise } from '../../../models/AsyncSelectorOption/Exercise'
import { isModifier } from '../../../models/AsyncSelectorOption/Modifier'
import { isRecord } from '../../../models/Record'

export const POST = async (req: NextRequest) => {
  if (process.env.NODE_ENV === 'production') {
    return Response.json(
      { statusCode: 403, message: 'This route is not available in production' },
      { status: 403 }
    )
  }

  const data = await req.json()

  console.log(data)
  console.log(isModifier(data))
  if (isRecord(data)) {
    return Response.json(await addRecord(data))
  } else if (isExercise(data)) {
    return Response.json(await addExercise(data))
  } else if (isModifier(data)) {
    return Response.json(await addModifier(data))
  } else if (isCategory(data)) {
    return Response.json(await addCategory(data))
  }

  return Response.json(
    { statusCode: 400, message: 'unsupported data type given' },
    { status: 400 }
  )
}
