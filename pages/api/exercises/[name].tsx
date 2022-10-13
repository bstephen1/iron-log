import type { NextApiRequest, NextApiResponse } from 'next'
import { createExercise, fetchExercise, updateExercise } from '../../../lib/backend/mongoService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const name = req.query.name

    console.log(`Incoming ${req.method} on exercise "${name}"`)

    if (!name || typeof name !== 'string') {
        res.status(400).json({ message: 'invalid exercise' })
        return
    }

    switch (req.method) {
        case 'GET':
            try {
                const exercise = await fetchExercise(name)
                res.status(200).json(exercise)
            } catch (e) {
                res.status(500).json({ message: 'error fetching exercises' })
            }
            break
        case 'POST':
            try {
                await createExercise(JSON.parse(req.body))
                res.status(201).end()
            } catch (e) {
                res.status(500).json({ message: 'could not create exercise' })
            }
            break
        case 'PUT':
            try {
                await updateExercise(JSON.parse(req.body))
                res.status(200).end()
            } catch (e) {
                console.error(e)
                res.status(500).json({ message: 'could not update exercise', error: e })
            }
    }
}
