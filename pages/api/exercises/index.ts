import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchExercises } from '../../../lib/backend/mongoService'
import { ExerciseStatus } from '../../../models/ExerciseStatus'
import { ExerciseParams } from '../../../models/rest/ExerciseParams'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Incoming ${req.method} on exercises`)

  try {
    const { status } = req.query as ExerciseParams

    if (
      status &&
      !Object.values(ExerciseStatus).includes(status as ExerciseStatus)
    ) {
      res.status(400).json({ message: 'invalid status' })
    }

    const exercises = await (status
      ? fetchExercises({ status: status })
      : fetchExercises())
    res.status(200).json(exercises)
  } catch (e) {
    res.status(500).json({ isError: true, message: 'error fetching exercises' })
  }
}
