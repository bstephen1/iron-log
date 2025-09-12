import path from 'node:path'
import dotenv from 'dotenv'

const envPath = path.resolve(__dirname, '..', '.env.test')
dotenv.config({
  path: envPath,
  // we have to override .env.dev vars
  override: true,
})

// must wait to import until dotenv is done pulling in env vars
const { db, client } = await import('../lib/backend/mongoConnect')

await db.dropDatabase()
await client.close()
