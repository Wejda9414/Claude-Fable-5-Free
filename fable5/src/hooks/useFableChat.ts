import { useState, useEffect, useCallback } from 'react'
import type { FableMessage } from '../types'
import { APP_CONFIG } from '../config/constants'

export function useFableChat() {
  const [messages, setMessages]     = useState<FableMessage[]>([])
  const [loading, setLoading]       = useState(false)
  const [totalTokens, setTokens]    = useState(0)
  const [fableAvailable, setAvail]  = useState(true)

  // Check Fable 5 availability on mount and every 30s
  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch('/api/fable5/status', { method: 'GET' })
        setAvail(r.ok)
      } catch { setAvail(false) }
    }
    check()
    const id = setInterval(check, APP_CONFIG.statusCheckInterval)
    return () => clearInterval(id)
  }, [])

  const send = useCallback(async (content: string) => {
    const msg: FableMessage = { id: crypto.randomUUID(), role: 'user', content, timestamp: new Date() }
    setMessages(prev => [...prev, msg])
    setLoading(true)
    const endpoint = fableAvailable ? APP_CONFIG.apiEndpoint : APP_CONFIG.fallbackEndpoint
    try {
      const res  = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, msg] }) })
      const data = await res.json()
      setTokens(t => t + (data.tokens ?? 0))
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: data.content, timestamp: new Date(), tokens: data.tokens }])
    } finally { setLoading(false) }
  }, [messages, fableAvailable])

  return { messages, loading, totalTokens, fableAvailable, send, clear: () => { setMessages([]); setTokens(0) } }
}