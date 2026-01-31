import postgres from 'postgres'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env manually
const envContent = readFileSync(resolve(process.cwd(), '.env'), 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx)
  let value = trimmed.slice(eqIdx + 1)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  if (!process.env[key]) process.env[key] = value
}

const file = process.argv[2]
if (!file) {
  console.error('Usage: npx tsx scripts/run-migration.ts <migration-file.sql>')
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL!, { prepare: false })
const migration = readFileSync(resolve(file), 'utf-8')

console.log(`Running migration: ${file}`)
sql.unsafe(migration).then(() => {
  console.log('Migration complete.')
  return sql.end()
}).catch((err) => {
  console.error('Migration failed:', err)
  sql.end()
  process.exit(1)
})
