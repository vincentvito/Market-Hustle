import { db } from '@/db'
import { authUsers, profiles } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function verifyAdmin(email: string | null): Promise<boolean> {
  if (!email) return false
  const [admin] = await db
    .select({ isAdmin: profiles.isAdmin })
    .from(authUsers)
    .innerJoin(profiles, eq(profiles.id, authUsers.id))
    .where(and(eq(authUsers.email, email), eq(profiles.isAdmin, true)))
    .limit(1)
  return !!admin
}
