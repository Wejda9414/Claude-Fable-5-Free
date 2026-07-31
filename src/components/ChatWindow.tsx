import React, { useRef, useEffect } from 'react'
import { MessageBubble } from '@/components/MessageBubble'
import { ContextMeter } from '@/components/ContextMeter'
import { InputBar } from '@/components/InputBar'
import { useContextWindow } from '@/hooks/useContextWindow'
import { getModelById } from '@/config/models'
import type { Session, SendStatus } from '@/types'

interface ChatWindowProps {
  session: Session
  status: SendStatus
  streamingText: string
  onSend: (content: string) => Promise<void>
  onAbort: () => void
  onSystemPromptChange: (prompt: string) => void
}

export function ChatWindow({
  session,
  status,
  streamingText,
  onSend,
  onAbort,
  onSystemPromptChange,
}: ChatWindowProps): React.ReactElement {
  const bottomRef = useRef<HTMLDivElement>(null)
  const model = getModelById(session.modelId)
  const maxCtx = model?.contextWindow ?? 1_000_000

  const contextState = useContextWindow({
    messages: session.messages,
    streamingText,
    maxTokens: maxCtx,
  })

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session.messages.length, streamingText])

  const isEmpty = session.messages.length === 0 && !streamingText

  return (
    <div className="chat-window">
      <div className="chat-window__meter">
        <ContextMeter state={contextState} />
      </div>

      <div className="chat-window__messages">
        {isEmpty && (
          <div className="chat-empty">
            <h2>Claude Fable 5 — 1M Token Context</h2>
            <p>Ask anything — entire codebases, long documents, deep research. Fable 5 handles it all in one context window.</p>
          </div>
        )}

        {session.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {streamingText && (
          <MessageBubble
            message={{
              id: '__streaming__',
              role: 'assistant',
              content: streamingText,
              timestamp: Date.now(),
            }}
            isStreaming
          />
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-window__input">
        <InputBar
          status={status}
          onSend={onSend}
          onAbort={onAbort}
          systemPrompt={session.systemPrompt}
          onSystemPromptChange={onSystemPromptChange}
        />
      </div>
    </div>
  )
}
