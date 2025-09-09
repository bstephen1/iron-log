import { z } from 'zod'

/** enforces YYYY-MM-DD format */
export const dateSchema = z.string().date()
