'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getActiveRoom } from '@/hooks/useRoom'

export function RoomRedirect() {
  const router = useRouter()

  useEffect(() => {
    const active = getActiveRoom()
    if (active) {
      router.replace(`/room/${active.roomId}`)
    }
  }, [router])

  return null
}
