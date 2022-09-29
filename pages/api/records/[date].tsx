import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchRecord } from '../../../lib/backend/mongoService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const date = req.query.date
    const validDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
    console.log(date)
    if (!date || typeof date !== 'string' || !date.match(validDateRegex)) {
        res.status(400).json({ error: 'invalid date' })
        return
    }

    try {
        const logs = await fetchRecord(date)
        res.status(200).json(logs)
    } catch (e) {
        res.status(500).json({ error: 'error fetching data' })
    }
}
