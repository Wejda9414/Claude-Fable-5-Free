export interface FableMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tokens?: number
}

export interface FableSession {
  id: string
  title: string
  messages: FableMessage[]
  totalTokens: number
  createdAt: Date
}

export interface FableStatus {
  available: boolean
  latencyMs: number | null
  lastChecked: Date
  fallbackModel: 'claude-sonnet-5' | null
}