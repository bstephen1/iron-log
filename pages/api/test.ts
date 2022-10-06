import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCollection } from '../../lib/backend/mongoService'
import { test } from '../../lib/backend/postgresService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const res_test = await test()
        res.status(200).json(res_test)
    } catch (e) {
        res.status(500).json({ error: 'error fetching modifiers' })
    }
}
