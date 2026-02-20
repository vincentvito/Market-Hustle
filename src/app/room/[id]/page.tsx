'use client'

import { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRoom } from '@/hooks/useRoom'
import { MarketHustle } from '@/components/game/MarketHustle'

export default function RoomPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const roomId = useRoom(state => state.roomId)
  const showRoomHub = useRoom(state => state.showRoomHub)
  const joinedRef = useRef(false)

  // If we navigated here directly (e.g. shared link) without room state,
  // fetch the room to get the code and join via it
  useEffect(() => {
    if (joinedRef.current || roomId === id) return
    joinedRef.current = true

    // Room not in store yet — fetch code then join
    ;(async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`)
        if (!res.ok) {
          router.replace('/')
          return
        }
        const data = await res.json()
        const code = data.room?.code
        if (!code) {
          router.replace('/')
          return
        }
        const result = await useRoom.getState().joinRoom(code)
        if (!result) {
          router.replace('/')
        }
      } catch {
        router.replace('/')
      }
    })()
  }, [id, roomId, router])

  // If room was cleaned up (left/closed), go home
  useEffect(() => {
    if (joinedRef.current && !roomId && !showRoomHub) {
      router.replace('/')
    }
  }, [roomId, showRoomHub, router])

  return <MarketHustle />
}
