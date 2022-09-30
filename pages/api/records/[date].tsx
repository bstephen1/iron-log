import type { NextApiRequest, NextApiResponse } from 'next'
import { createRecord, fetchRecord, updateRecord } from '../../../lib/backend/mongoService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const date = req.query.date
    const validDateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
    if (!date || typeof date !== 'string' || !date.match(validDateRegex)) {
        res.status(400).json({ message: 'invalid date' })
        return
    }
    console.info(`Incoming ${req.method} ${req.body}`)

    switch (req.method) {
        case 'GET':
            try {
                const record = await fetchRecord(date)
                res.status(200).json(record)
            } catch (e) {
                res.status(500).json({ message: 'could not fetch data' })
            }
            break
        case 'POST':
            try {
                await createRecord(JSON.parse(req.body))
                res.status(201).end()
            } catch (e) {
                res.status(500).json({ message: 'could not create record' })
            }
            break
        case 'PUT':
            try {
                await updateRecord(JSON.parse(req.body))
                res.status(200).end()
            } catch (e) {
                res.status(500).json({ message: 'could not update record' })
            }
    }
}
