import React, { useState } from 'react'
import type { PromptTemplate } from '@/types'

const TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-review',
    label: 'Code Review',
    category: 'coding',
    description: 'Deep review of a codebase or file',
    prompt: 'Please do a thorough code review of the following code. Identify bugs, security issues, performance problems, and suggest improvements:\n\n',
  },
  {
    id: 'refactor',
    label: 'Refactor',
    category: 'coding',
    description: 'Refactor code to be cleaner and more maintainable',
    prompt: 'Refactor the following code to improve readability, maintainability, and performance. Explain each change:\n\n',
  },
  {
    id: 'explain-code',
    label: 'Explain Code',
    category: 'coding',
    description: 'Line-by-line explanation of complex code',
    prompt: 'Explain the following code in detail, describing what each part does, the design decisions, and any potential edge cases:\n\n',
  },
  {
    id: 'write-tests',
    label: 'Write Tests',
    category: 'coding',
    description: 'Generate comprehensive unit tests',
    prompt: 'Write comprehensive unit tests for the following code. Cover happy paths, edge cases, and error conditions:\n\n',
  },
  {
    id: 'agentic-coding',
    label: 'Agentic Task',
    category: 'coding',
    description: 'Multi-step autonomous coding workflow',
    prompt: 'You are working as an autonomous coding agent. Plan, implement, and verify the following feature end-to-end. Break it into steps, implement each one, then review the complete solution:\n\n',
  },
  {
    id: 'research-summary',
    label: 'Research Summary',
    category: 'research',
    description: 'Summarize and synthesize multiple sources',
    prompt: 'Read the following documents/text and produce a comprehensive research summary with key findings, themes, contradictions, and conclusions:\n\n',
  },
  {
    id: 'literature-review',
    label: 'Literature Review',
    category: 'research',
    description: 'Academic-style literature review',
    prompt: 'Write a structured literature review on the following topic, covering major theories, key studies, debates, and open questions:\n\n',
  },
  {
    id: 'compare-analyze',
    label: 'Comparative Analysis',
    category: 'analysis',
    description: 'Compare and contrast multiple items',
    prompt: 'Perform a detailed comparative analysis of the following. Include similarities, differences, trade-offs, and a recommendation:\n\n',
  },
  {
    id: 'creative-story',
    label: 'Creative Story',
    category: 'writing',
    description: 'Long-form fiction writing',
    prompt: 'Write a compelling, detailed story based on the following premise. Focus on character development, vivid description, and narrative arc:\n\n',
  },
  {
    id: 'essay',
    label: 'Long Essay',
    category: 'writing',
    description: 'Structured long-form essay',
    prompt: 'Write a thorough, well-structured essay on the following topic. Include introduction, developed arguments with evidence, counterarguments, and a strong conclusion:\n\n',
  },
  {
    id: 'system-design',
    label: 'System Design',
    category: 'coding',
    description: 'Design a software system architecture',
    prompt: 'Design a complete system architecture for the following requirements. Cover components, data flow, API design, storage, scaling, and failure modes:\n\n',
  },
  {
    id: 'debug',
    label: 'Debug Issue',
    category: 'coding',
    description: 'Find and fix a bug',
    prompt: 'Debug the following issue. Identify the root cause, explain why it happens, and provide a complete fix with explanation:\n\n',
  },
]

const CATEGORIES = ['all', 'coding', 'research', 'writing', 'analysis', 'general'] as const
type Category = typeof CATEGORIES[number]

interface PromptLibraryProps {
  onSelect: (prompt: string) => void
  onClose: () => void
}

export function PromptLibrary({ onSelect, onClose }: PromptLibraryProps): React.ReactElement {
  const [filter, setFilter] = useState<Category>('all')
  const [search, setSearch] = useState('')

  const filtered = TEMPLATES.filter((t) => {
    const matchCategory = filter === 'all' || t.category === filter
    const matchSearch =
      !search ||
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div
      className="prompt-library-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Prompt library"
    >
      <div className="prompt-library">
        <header className="prompt-library__header">
          <h2>Prompt Library</h2>
          <button
            className="btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close prompt library"
            type="button"
          >
            ✕
          </button>
        </header>

        <div className="prompt-library__filters">
          <input
            className="prompt-library__search"
            type="search"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search prompts"
          />
          <div className="prompt-library__cats" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                className={`prompt-library__cat${filter === cat ? ' active' : ''}`}
                onClick={() => setFilter(cat)}
                type="button"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ul className="prompt-library__list" role="list">
          {filtered.map((t) => (
            <li key={t.id} className="prompt-library__item">
              <button
                className="prompt-library__card"
                onClick={() => onSelect(t.prompt)}
                type="button"
              >
                <div className="prompt-library__card-header">
                  <span className="prompt-library__card-label">{t.label}</span>
                  <span className={`prompt-library__cat-tag cat-${t.category}`}>{t.category}</span>
                </div>
                <p className="prompt-library__card-desc">{t.description}</p>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="prompt-library__empty">No prompts match your search.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
