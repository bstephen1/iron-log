import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchActiveExercises, fetchAllExercises } from '../../lib/backend/postgresService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // const exercises = await fetchCollection('exercises')
        const exercises = await fetchAllExercises()
        res.status(200).json(exercises)
    } catch (e) {
        res.status(500).json({ error: 'error fetching exercises' })
    }
}
