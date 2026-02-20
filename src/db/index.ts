import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 5,              // Limit pool size to avoid hitting Supabase connection limits
  idle_timeout: 20,    // Close idle connections after 20 seconds
})
export const db = drizzle(client, { schema })
