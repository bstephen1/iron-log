import type { NextApiRequest, NextApiResponse } from 'next'
import { createSession, fetchSession, updateSession } from '../../../lib/backend/mongoService'
import { validDateStringRegex } from '../../../lib/frontend/constants'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const date = req.query.date

    if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
        res.status(400).json({ message: 'invalid date' })
        return
    }
    console.log(`Incoming ${req.method} (${req.query.date}) ${req.body}`)

    switch (req.method) {
        case 'GET':
            try {
                const record = await fetchSession(date)
                res.status(200).json(record)
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
