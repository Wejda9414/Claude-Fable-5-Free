import './StatusBar.css'
import type { FableStatus } from '../../types'

interface Props { status: FableStatus; contextUsed: number }

export function StatusBar({ status, contextUsed }: Props) {
  const pct = Math.min((contextUsed / 1_000_000) * 100, 100)
  return (
    <div className="status-bar">
      <span className={`status-bar__dot ${status.available ? 'status-bar__dot--ok' : 'status-bar__dot--err'}`} />
      <span className="status-bar__label">{status.available ? 'Fable 5 online' : 'Sonnet 5 fallback'}</span>
      {status.latencyMs && <span className="status-bar__latency">{status.latencyMs}ms</span>}
      <div className="status-bar__ctx-rail">
        <div className="status-bar__ctx-fill" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : '#22c55e' }} />
      </div>
      <span className="status-bar__ctx-label">{(contextUsed / 1000).toFixed(0)}K / 1M</span>
    </div>
  )
}