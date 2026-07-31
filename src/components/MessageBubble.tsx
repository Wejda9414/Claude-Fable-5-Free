import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { formatTokenCount } from '@/utils/tokenCounter'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps): React.ReactElement {
  const isUser = message.role === 'user'
  const content = typeof message.content === 'string' ? message.content : ''

  return (
    <div
      className={`message-bubble message-bubble--${message.role}${isStreaming ? ' message-bubble--streaming' : ''}`}
      role="article"
      aria-label={`${message.role} message`}
    >
      <div className="message-bubble__header">
        <span className="message-bubble__role">
          {isUser ? 'You' : 'Claude Fable 5'}
        </span>
        {message.tokenCount !== undefined && message.tokenCount > 0 && (
          <span className="message-bubble__tokens" title="Token count">
            {formatTokenCount(message.tokenCount)} tokens
          </span>
        )}
        {isStreaming && (
          <span className="message-bubble__typing" aria-label="Typing">
            <span />
            <span />
            <span />
          </span>
        )}
      </div>

      <div className="message-bubble__content">
        {isUser ? (
          <p className="message-bubble__plain">{content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: ({ children }) => (
                <div className="code-block">
                  <pre>{children}</pre>
                </div>
              ),
              code: ({ className, children, ...props }) => {
                const isBlock = className?.startsWith('language-')
                return isBlock ? (
                  <code className={className} {...props}>{children}</code>
                ) : (
                  <code className="inline-code" {...props}>{children}</code>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
