import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * POST /api/username/check
 * Check if a username is available and valid
 *
 * Body: { username: string }
 * Response: { available: boolean, reason?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { available: false, reason: 'Username is required' },
        { status: 400 }
      )
    }

    // Validate username format
    const trimmedUsername = username.trim().toLowerCase()

    // Check length (3-15 characters)
    if (trimmedUsername.length < 3) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be at least 3 characters',
      })
    }

    if (trimmedUsername.length > 15) {
      return NextResponse.json({
        available: false,
        reason: 'Username must be 15 characters or less',
      })
    }

    // Check format (alphanumeric + underscores only)
    const validFormat = /^[a-z0-9_]+$/.test(trimmedUsername)
    if (!validFormat) {
      return NextResponse.json({
        available: false,
        reason: 'Username can only contain letters, numbers, and underscores',
      })
    }

    // Check for reserved words
    const reservedWords = ['admin', 'moderator', 'mod', 'system', 'support', 'help', 'official', 'staff']
    if (reservedWords.includes(trimmedUsername)) {
      return NextResponse.json({
        available: false,
        reason: 'This username is reserved',
      })
    }

    // Check availability in database
    const existing = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.username, trimmedUsername))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({
        available: false,
        reason: 'This username is already taken',
      })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    console.error('Error checking username:', error)
    return NextResponse.json(
      { available: false, reason: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
