export interface FableMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface FableSession {
  id: string
  title: string
  messages: FableMessage[]
  createdAt: Date
}

export interface FableConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  streamOutput: boolean
}
