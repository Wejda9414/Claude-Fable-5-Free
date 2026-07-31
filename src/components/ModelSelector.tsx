import React, { useRef, useEffect } from 'react'
import { FABLE5_MODELS } from '@/config/models'
import type { ModelConfig } from '@/types'

interface ModelSelectorProps {
  currentModelId: string
  onSelect: (id: string) => void
}

export function ModelSelector({ currentModelId, onSelect }: ModelSelectorProps): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = FABLE5_MODELS.find((m) => m.id === currentModelId) ?? FABLE5_MODELS[0]

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(model: ModelConfig): void {
    onSelect(model.id)
    setOpen(false)
  }

  const ctxLabel = (n: number): string =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(0)}M ctx` : `${(n / 1_000).toFixed(0)}K ctx`

  return (
    <div className="model-selector" ref={ref}>
      <button
        className="model-selector__trigger btn-ghost"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="model-selector__name">{current.name}</span>
        <span className="model-selector__ctx">{ctxLabel(current.contextWindow)}</span>
        <span className="model-selector__chevron" aria-hidden>▾</span>
      </button>

      {open && (
        <ul
          className="model-selector__dropdown"
          role="listbox"
          aria-label="Select model"
        >
          {FABLE5_MODELS.map((model) => (
            <li
              key={model.id}
              className={`model-selector__item${model.id === currentModelId ? ' active' : ''}`}
              role="option"
              aria-selected={model.id === currentModelId}
              onClick={() => handleSelect(model)}
            >
              <div className="model-selector__item-name">{model.name}</div>
              <div className="model-selector__item-meta">
                {ctxLabel(model.contextWindow)} · {model.description}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
