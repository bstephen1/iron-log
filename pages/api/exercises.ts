import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCollection } from '../../lib/mongoService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const exercises = await fetchCollection('exercises')
        res.status(200).json(exercises)
    } catch (e) {
        res.status(500).json({ error: 'error fetching data' })
    }
}
