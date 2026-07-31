import React, { useState, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import type { SendStatus } from '@/types'

interface InputBarProps {
  status: SendStatus
  onSend: (content: string) => Promise<void>
  onAbort: () => void
  systemPrompt: string
  onSystemPromptChange: (prompt: string) => void
}

export function InputBar({
  status,
  onSend,
  onAbort,
  systemPrompt,
  onSystemPromptChange,
}: InputBarProps): React.ReactElement {
  const [text, setText] = useState('')
  const [showSystem, setShowSystem] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isBusy = status === 'streaming' || status === 'sending'

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSend(): void {
    const trimmed = text.trim()
    if (!trimmed || isBusy) return
    setText('')
    void onSend(trimmed)
  }

  return (
    <div className="input-bar">
      {showSystem && (
        <div className="input-bar__system">
          <label htmlFor="system-prompt" className="input-bar__system-label">
            System prompt
          </label>
          <TextareaAutosize
            id="system-prompt"
            className="input-bar__system-textarea"
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            minRows={2}
            maxRows={8}
            placeholder="Enter a system prompt (optional)..."
          />
        </div>
      )}

      <div className="input-bar__row">
        <button
          className={`input-bar__system-toggle btn-ghost btn-sm${showSystem ? ' active' : ''}`}
          onClick={() => setShowSystem((v) => !v)}
          title="Toggle system prompt"
          aria-label="Toggle system prompt"
          type="button"
        >
          ⚙
        </button>

        <TextareaAutosize
          ref={textareaRef}
          className="input-bar__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Fable 5… (Shift+Enter for new line)"
          minRows={1}
          maxRows={12}
          disabled={isBusy && status !== 'streaming'}
          aria-label="Message input"
        />

        {isBusy ? (
          <button
            className="input-bar__abort btn-danger"
            onClick={onAbort}
            type="button"
            aria-label="Stop generation"
            title="Stop"
          >
            ■ Stop
          </button>
        ) : (
          <button
            className="input-bar__send btn-primary"
            onClick={handleSend}
            disabled={!text.trim()}
            type="button"
            aria-label="Send message"
            title="Send (Enter)"
          >
            Send
          </button>
        )}
      </div>
    </div>
  )
}
