import { useState, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { streamMessage, sendMessage } from '@/utils/api'
import { estimateMessagesTokens } from '@/utils/tokenCounter'
import { DEFAULT_SYSTEM_PROMPT } from '@/config/constants'
import { getDefaultModel } from '@/config/models'
import type { Message, Session, SendStatus, AnthropicRequest } from '@/types'

interface UseFableChatOptions {
  apiKey: string
  modelId?: string
  systemPrompt?: string
  streamingEnabled?: boolean
  temperature?: number
  maxTokens?: number
}

interface UseFableChatReturn {
  session: Session
  status: SendStatus
  streamingText: string
  sendUserMessage: (content: string) => Promise<void>
  clearSession: () => void
  setSystemPrompt: (prompt: string) => void
  setModelId: (id: string) => void
  abortStream: () => void
}

function createEmptySession(modelId: string, systemPrompt: string): Session {
  return {
    id: uuidv4(),
    title: 'New session',
    modelId,
    messages: [],
    systemPrompt,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    totalTokensUsed: 0,
  }
}

export function useFableChat(options: UseFableChatOptions): UseFableChatReturn {
  const {
    apiKey,
    modelId: initialModelId,
    systemPrompt: initialSystemPrompt = DEFAULT_SYSTEM_PROMPT,
    streamingEnabled = true,
    temperature = 0.7,
    maxTokens = 8192,
  } = options

  const defaultModel = getDefaultModel()
  const [session, setSession] = useState<Session>(() =>
    createEmptySession(initialModelId ?? defaultModel.id, initialSystemPrompt)
  )
  const [status, setStatus] = useState<SendStatus>('idle')
  const [streamingText, setStreamingText] = useState('')
  const abortRef = useRef(false)

  const setSystemPrompt = useCallback((prompt: string) => {
    setSession((s) => ({ ...s, systemPrompt: prompt }))
  }, [])

  const setModelId = useCallback((id: string) => {
    setSession((s) => ({ ...s, modelId: id }))
  }, [])

  const abortStream = useCallback(() => {
    abortRef.current = true
  }, [])

  const sendUserMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || status === 'streaming' || status === 'sending') return

      const userMsg: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: Date.now(),
        tokenCount: estimateMessagesTokens([{ role: 'user', content }]),
      }

      setSession((s) => ({
        ...s,
        messages: [...s.messages, userMsg],
        updatedAt: Date.now(),
        title: s.messages.length === 0 ? content.slice(0, 60) : s.title,
      }))

      const request: AnthropicRequest = {
        model: session.modelId,
        max_tokens: maxTokens,
        temperature,
        system: session.systemPrompt || undefined,
        messages: [
          ...session.messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content as string,
          })),
          { role: 'user' as const, content },
        ],
        stream: streamingEnabled,
      }

      abortRef.current = false

      if (streamingEnabled) {
        setStatus('streaming')
        setStreamingText('')

        let accumulated = ''

        await streamMessage(
          apiKey,
          request,
          (chunk) => {
            if (abortRef.current) return
            accumulated += chunk
            setStreamingText(accumulated)
          },
          (inputTokens, outputTokens) => {
            const assistantMsg: Message = {
              id: uuidv4(),
              role: 'assistant',
              content: accumulated,
              timestamp: Date.now(),
              tokenCount: outputTokens,
              modelId: session.modelId,
            }
            setSession((s) => ({
              ...s,
              messages: [...s.messages, assistantMsg],
              updatedAt: Date.now(),
              totalTokensUsed: s.totalTokensUsed + inputTokens + outputTokens,
            }))
            setStreamingText('')
            setStatus('idle')
          },
          (errMsg) => {
            console.error('[fable5] stream error:', errMsg)
            setStatus('error')
            setStreamingText('')
          }
        )
      } else {
        setStatus('sending')
        try {
          const { content: text, inputTokens, outputTokens } = await sendMessage(apiKey, request)
          const assistantMsg: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: text,
            timestamp: Date.now(),
            tokenCount: outputTokens,
            modelId: session.modelId,
          }
          setSession((s) => ({
            ...s,
            messages: [...s.messages, assistantMsg],
            updatedAt: Date.now(),
            totalTokensUsed: s.totalTokensUsed + inputTokens + outputTokens,
          }))
          setStatus('idle')
        } catch (err) {
          console.error('[fable5] send error:', err)
          setStatus('error')
        }
      }
    },
    [apiKey, maxTokens, session, status, streamingEnabled, temperature]
  )

  const clearSession = useCallback(() => {
    setSession(createEmptySession(session.modelId, session.systemPrompt))
    setStatus('idle')
    setStreamingText('')
  }, [session.modelId, session.systemPrompt])

  return { session, status, streamingText, sendUserMessage, clearSession, setSystemPrompt, setModelId, abortStream }
}
