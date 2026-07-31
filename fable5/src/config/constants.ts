export const APP_CONFIG = {
  name: 'Claude Fable 5 Free Desktop',
  version: '1.0.0',
  contextLimit: 1_000_000,
  statusCheckInterval: 30_000,
  apiEndpoint: '/api/fable5',
  fallbackEndpoint: '/api/sonnet5',
  streamEnabled: true,
}

export const STORAGE_KEYS = {
  sessions: 'fable5_sessions',
  settings: 'fable5_settings',
}

export const STATUS_MESSAGES: Record<string, string> = {
  available:   'Claude Fable 5: Available',
  unavailable: 'Claude Fable 5: Unavailable — using Sonnet 5 fallback',
  checking:    'Checking Claude Fable 5 status…',
}