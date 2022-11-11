import type { NextApiRequest, NextApiResponse } from 'next'
import {
  addExercise,
  fetchExercise,
  updateExercise,
  updateExerciseFields,
} from '../../../lib/backend/mongoService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id

  console.log(`Incoming ${req.method} on exercise "${id}"`)

  if (!id || typeof id !== 'string') {
    res.status(400).json({ isError: true, message: 'invalid exercise' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const exercise = await fetchExercise(id)
        res.status(200).json(exercise)
      } catch (e) {
        res
          .status(500)
          .json({ isError: true, message: 'error fetching exercises' })
      }
      break
    case 'POST':
      try {
        await addExercise(JSON.parse(req.body))
        res.status(201).end()
      } catch (e) {
        res
          .status(500)
          .json({ isError: true, message: 'could not create exercise' })
      }
      break
    case 'PUT':
      try {
        await updateExercise(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res.status(500).json({
          isError: true,
          message: 'could not update exercise',
          error: e,
        })
      }
    case 'PATCH':
      try {
        await updateExerciseFields(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res.status(500).json({
          isError: true,
          message: 'could not update exercise',
          error: e,
        })
      }
  }
}
