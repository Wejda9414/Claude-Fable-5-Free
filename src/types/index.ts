export type MessageRole = 'user' | 'assistant' | 'system'

export type ModelTier = 'fable' | 'fable-mini' | 'sonnet' | 'opus'

export interface ModelConfig {
  id: string
  name: string
  contextWindow: number
  maxOutput: number
  description: string
  tier: ModelTier
  supportsVision: boolean
  supportsTools: boolean
}

export interface ContentBlock {
  type: 'text' | 'image_url'
  text?: string
  image_url?: { url: string }
}

export interface Message {
  id: string
  role: MessageRole
  content: string | ContentBlock[]
  timestamp: number
  tokenCount?: number
  modelId?: string
}

export interface Session {
  id: string
  title: string
  modelId: string
  messages: Message[]
  systemPrompt: string
  createdAt: number
  updatedAt: number
  totalTokensUsed: number
}

export interface ApiSettings {
  apiKey: string
  baseUrl: string
  temperature: number
  maxTokens: number
  streamingEnabled: boolean
}

export interface AppSettings {
  api: ApiSettings
  theme: 'dark' | 'light' | 'system'
  fontSize: number
  showTokenUsage: boolean
  defaultModelId: string
  defaultSystemPrompt: string
}

export interface ContextWindowState {
  usedTokens: number
  maxTokens: number
  percentage: number
  status: 'ok' | 'warning' | 'critical'
}

export interface StreamChunk {
  type: 'content_block_delta' | 'message_delta' | 'message_stop' | 'error'
  delta?: { type: string; text?: string }
  usage?: { output_tokens: number }
  error?: { type: string; message: string }
}

export interface AnthropicRequest {
  model: string
  max_tokens: number
  temperature: number
  system?: string
  messages: Array<{ role: 'user' | 'assistant'; content: string | ContentBlock[] }>
  stream: boolean
}

export interface AnthropicError {
  type: string
  error: { type: string; message: string }
}

export interface PromptTemplate {
  id: string
  label: string
  category: 'coding' | 'writing' | 'research' | 'analysis' | 'general'
  prompt: string
  description: string
}

export type SendStatus = 'idle' | 'sending' | 'streaming' | 'error'
