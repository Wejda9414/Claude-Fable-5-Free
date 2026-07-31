import { useMemo } from 'react'
import { estimateMessagesTokens } from '@/utils/tokenCounter'
import { CONTEXT_WARNING_THRESHOLD, CONTEXT_CRITICAL_THRESHOLD } from '@/config/constants'
import type { Message, ContextWindowState } from '@/types'

interface UseContextWindowOptions {
  messages: Message[]
  streamingText?: string
  maxTokens: number
}

export function useContextWindow({
  messages,
  streamingText = '',
  maxTokens,
}: UseContextWindowOptions): ContextWindowState {
  const usedTokens = useMemo(() => {
    const fromMessages = estimateMessagesTokens(
      messages.map((m) => ({ role: m.role, content: m.content as string }))
    )
    const fromStreaming = streamingText
      ? Math.ceil(streamingText.length / 3.8)
      : 0
    return fromMessages + fromStreaming
  }, [messages, streamingText])

  const percentage = maxTokens > 0 ? usedTokens / maxTokens : 0

  const status: ContextWindowState['status'] =
    percentage >= CONTEXT_CRITICAL_THRESHOLD
      ? 'critical'
      : percentage >= CONTEXT_WARNING_THRESHOLD
      ? 'warning'
      : 'ok'

  return { usedTokens, maxTokens, percentage, status }
}
