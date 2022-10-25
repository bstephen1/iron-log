import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchModifiers } from '../../../lib/backend/mongoService'
import { ModifierStatus } from '../../../models/ModifierStatus'
import { ModifierParams } from '../../../models/rest/ModifierParams'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Incoming ${req.method} on modifiers`)

  try {
    const { status } = req.query as ModifierParams

    if (
      status &&
      !Object.values(ModifierStatus).includes(status as ModifierStatus)
    ) {
      res.status(400).json({ isError: true, message: 'invalid status' })
    }

    const modifiers = await (status
      ? fetchModifiers({ status: status as ModifierStatus }) // should not have to explicity assert this but ts isn't recognizing the if check above
      : fetchModifiers())
    res.status(200).json(modifiers)
  } catch (e) {
    res.status(500).json({ isError: true, message: 'error fetching modifiers' })
  }
}
