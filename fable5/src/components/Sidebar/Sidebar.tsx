import { useState } from 'react'
import type { FableSession } from '../../types'

interface Props {
  sessions: FableSession[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export function Sidebar({ sessions, activeId, onSelect, onNew, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const filtered = sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ width: 240, background: '#0a0a18', borderRight: '1px solid #1a1a2e', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '14px 12px' }}>
        <button onClick={onNew} style={{ width: '100%', padding: '8px 0', borderRadius: 8, background: '#6d28d9', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          + New chat
        </button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
        style={{ margin: '0 12px 8px', padding: '6px 10px', borderRadius: 8, background: '#1a1a2e', border: '1px solid #2a2a3e', color: '#e0e0e0', fontSize: 12, outline: 'none' }} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {filtered.map(s => (
          <div key={s.id} onClick={() => onSelect(s.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, marginBottom: 2, cursor: 'pointer', background: s.id === activeId ? '#1a1a2e' : 'transparent' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, color: '#e0e0e0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.title}</div>
              <div style={{ fontSize: 10, color: '#555' }}>{(s.totalTokens / 1000).toFixed(0)}K tokens</div>
            </div>
            <span onClick={e => { e.stopPropagation(); onDelete(s.id) }} style={{ color: '#444', fontSize: 16, cursor: 'pointer', paddingLeft: 6 }}>×</span>
          </div>
        ))}
      </div>
    </div>
  )
}