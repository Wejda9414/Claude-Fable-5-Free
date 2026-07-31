export const FABLE5_MAX_TOKENS = 1_000_000

export const FABLE5_DEFAULT_MAX_OUTPUT = 8192

export const FABLE5_DEFAULT_TEMPERATURE = 0.7

export const CONTEXT_WARNING_THRESHOLD = 0.8   // warn at 80% of context used
export const CONTEXT_CRITICAL_THRESHOLD = 0.95  // critical at 95%

export const API_BASE_URL = 'https://api.anthropic.com/v1'

export const ANTHROPIC_VERSION = '2023-06-01'

export const DEFAULT_SYSTEM_PROMPT =
  'You are Claude Fable 5, Anthropic\'s advanced model with a 1 million token context window. ' +
  'You excel at autonomous coding, deep research, and long-form creative writing.'

export const SESSION_STORAGE_KEY = 'fable5_sessions'
export const SETTINGS_STORAGE_KEY = 'fable5_settings'

export const RETRY_ATTEMPTS = 3
export const RETRY_DELAY_MS = 1000

export const STREAM_CHUNK_TIMEOUT_MS = 30_000

export const APP_VERSION = '1.0.0'
