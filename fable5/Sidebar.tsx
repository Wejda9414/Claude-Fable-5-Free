import React, { useState } from 'react'
import type { FableSession } from './types'

interface Props {
  sessions: FableSession[]
  active: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export function Sidebar({ sessions, active, onSelect, onNew, onDelete }: Props) {
  const [hover, setHover] = useState<string | null>(null)

  return (
    <div style={{ width: 240, background: '#0a0a0a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '14px 12px' }}>
        <button onClick={onNew} style={{ width: '100%', padding: '8px 0', borderRadius: 8, background: '#6d28d9', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
          + New chat
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {sessions.map(s => (
          <div
            key={s.id}
            onMouseEnter={() => setHover(s.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect(s.id)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, marginBottom: 2, cursor: 'pointer', background: s.id === active ? '#1a1a2e' : hover === s.id ? '#111' : 'transparent' }}
          >
            <span style={{ fontSize: 13, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{s.title}</span>
            <span onClick={e => { e.stopPropagation(); onDelete(s.id) }} style={{ color: '#555', fontSize: 16, paddingLeft: 6, cursor: 'pointer' }}>×</span>
          </div>
        ))}
      </div>
    </div>
  )
}
