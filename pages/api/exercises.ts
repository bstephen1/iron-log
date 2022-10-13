import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCollection } from '../../lib/backend/mongoService'
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

    console.log(`Incoming ${req.method} (${req.query.date}) ${req.body}`)

    switch (req.method) {
        case 'GET':
            try {
                const { status } = req.query as ExerciseParams
                const exercises = await (status ? fetchCollection('exercises', { status: status }) : fetchCollection('exercises'))
                res.status(200).json(exercises)
            } catch (e) {
                res.status(500).json({ message: 'could not fetch data' })
            }
            break
        case 'POST':
            try {
                await createSession(JSON.parse(req.body))
                res.status(201).end()
            } catch (e) {
                res.status(500).json({ message: 'could not create record' })
            }
            break
        case 'PUT':
            try {
                await updateSession(JSON.parse(req.body))
                res.status(200).end()
            } catch (e) {
                res.status(500).json({ message: 'could not update record' })
            }
    }
}
