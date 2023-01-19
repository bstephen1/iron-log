import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchExercises } from '../../../lib/backend/mongoService'
import { ExerciseStatus } from '../../../models/ExerciseStatus'
import { ExerciseQuery } from '../../../models/query-filters/ExerciseQuery'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Incoming ${req.method} on exercises`)

  try {
    const { status, category, name } = req.query as ExerciseQuery

    if (status && !Object.values(ExerciseStatus).includes(status)) {
      res.status(400).end()
    }

    // todo: this is a bit of a hack to make the api param singular despite the mongo field being plural. Ideally status/categories could accept arrays.
    const query = {} as any
    if (status) query.status = status
    if (category) query.categories = category
    if (name) query.name = name

    const exercises = await fetchExercises(query)
    res.status(200).json(exercises)
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
