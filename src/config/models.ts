import type { ModelConfig } from '@/types'

export const FABLE5_MODELS: ModelConfig[] = [
  {
    id: 'claude-fable-5-20260701',
    name: 'Claude Fable 5',
    contextWindow: 1_000_000,
    maxOutput: 8192,
    description: 'Anthropic Fable 5 — 1M context, autonomous coding & research',
    tier: 'fable',
    supportsVision: true,
    supportsTools: true,
  },
  {
    id: 'claude-fable-5-mini-20260701',
    name: 'Claude Fable 5 Mini',
    contextWindow: 200_000,
    maxOutput: 4096,
    description: 'Fable 5 Mini — faster responses, 200K context',
    tier: 'fable-mini',
    supportsVision: true,
    supportsTools: true,
  },
  {
    id: 'claude-sonnet-5-20260601',
    name: 'Claude Sonnet 5',
    contextWindow: 200_000,
    maxOutput: 8192,
    description: 'Fast & efficient — 200K context, great for everyday tasks',
    tier: 'sonnet',
    supportsVision: true,
    supportsTools: true,
  },
  {
    id: 'claude-opus-4-20260101',
    name: 'Claude Opus 4',
    contextWindow: 200_000,
    maxOutput: 4096,
    description: 'Maximum reasoning capability — 200K context',
    tier: 'opus',
    supportsVision: true,
    supportsTools: true,
  },
]

export const DEFAULT_MODEL_ID = 'claude-fable-5-20260701'

export const getModelById = (id: string): ModelConfig | undefined =>
  FABLE5_MODELS.find((m) => m.id === id)

export const getDefaultModel = (): ModelConfig =>
  FABLE5_MODELS.find((m) => m.id === DEFAULT_MODEL_ID)!
