import type { NextApiRequest, NextApiResponse } from 'next'
import { createRecord, fetchRecord } from '../../../lib/backend/mongoService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const date = req.query.date
    const validDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
    if (!date || typeof date !== 'string' || !date.match(validDateRegex)) {
        res.status(400).json({ error: 'invalid date' })
        return
    }
    console.info(`Incoming ${req.method} ${req.body}`)

    switch (req.method) {
        case 'GET':
            try {
                const records = await fetchRecord(date)
                res.status(200).json(records)
            } catch (e) {
                res.status(500).json({ error: 'error fetching data' })
            }
            break
        case 'POST':
            try {
                await createRecord(JSON.parse(req.body))
                res.status(201).end()
            } catch (e) {
                res.status(500).json({ error: 'error creating record' })
            }
            break
    }
}
