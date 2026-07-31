import React from 'react'
import { formatTokenCount } from '@/utils/tokenCounter'
import type { ContextWindowState } from '@/types'

interface ContextMeterProps {
  state: ContextWindowState
}

export function ContextMeter({ state }: ContextMeterProps): React.ReactElement {
  const { usedTokens, maxTokens, percentage, status } = state
  const pct = Math.min(100, Math.round(percentage * 100))

  const statusLabel: Record<ContextWindowState['status'], string> = {
    ok: 'Context OK',
    warning: 'Context filling up',
    critical: 'Context almost full',
  }

  return (
    <div
      className={`context-meter context-meter--${status}`}
      role="meter"
      aria-valuenow={usedTokens}
      aria-valuemin={0}
      aria-valuemax={maxTokens}
      aria-label={`Context window: ${pct}% used`}
    >
      <div className="context-meter__label">
        <span className="context-meter__used">
          {formatTokenCount(usedTokens)}
        </span>
        <span className="context-meter__sep">/</span>
        <span className="context-meter__max">
          {formatTokenCount(maxTokens)}
        </span>
        <span className="context-meter__status">{statusLabel[status]}</span>
      </div>

      <div className="context-meter__track">
        <div
          className="context-meter__fill"
          style={{ width: `${pct}%` }}
        />
      </div>

      <span className="context-meter__pct">{pct}%</span>
    </div>
  )
}
