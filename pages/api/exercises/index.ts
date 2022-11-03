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
    const { status, category } = req.query as ExerciseParams

    if (status && !Object.values(ExerciseStatus).includes(status)) {
      res.status(400).json({ isError: true, message: 'invalid status' })
    }

    // todo: this is a bit of a hack to make the api param singular despite the mongo field being plural. Ideally status/categories could accept arrays.
    const query = {} as any
    if (status) query.status = status
    if (category) query.categories = category

    const exercises = await fetchExercises(query)
    res.status(200).json(exercises)
  } catch (e) {
    res.status(500).json({ isError: true, message: 'error fetching exercises' })
  }
}
