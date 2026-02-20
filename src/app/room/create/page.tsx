'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'

export default function RoomCreatePage() {
  const router = useRouter()
  const createRoom = useRoom(state => state.createRoom)
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current) return
    attempted.current = true

    createRoom().then((result) => {
      if (result) {
        router.replace(`/room/${result.roomId}`)
      } else {
        router.replace('/')
      }
    })
  }, [createRoom, router])

  return (
    <div className="h-full bg-mh-bg flex items-center justify-center">
      <div className="text-center">
        <div className="text-mh-text-dim text-sm font-mono animate-pulse">CREATING ROOM...</div>
      </div>
    </div>
  )
}
