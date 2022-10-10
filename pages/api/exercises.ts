import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCollection } from '../../lib/backend/mongoService'
import { fetchExercises, fetchExercisesWithStatus } from '../../lib/backend/postgresService'
import { ExerciseParams } from '../../models/rest/ExerciseParams'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { status } = req.query as ExerciseParams
        const exercises = await (status ? fetchCollection('exercises', { status: status }) : fetchCollection('exercises'))
        res.status(200).json(exercises)
    } catch (e) {
        res.status(500).json({ error: 'error fetching exercises' })
    }
}
