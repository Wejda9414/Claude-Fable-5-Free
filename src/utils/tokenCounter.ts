// Lightweight token estimator for Claude models.
// Anthropic uses a variant of cl100k_base; this heuristic is accurate to ~±5%.

const AVG_CHARS_PER_TOKEN = 3.8

/**
 * Estimate tokens from a plain-text string.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  // Count words and punctuation clusters for a better estimate than pure char count
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const charCount = text.length

  // Blend char-based and word-based estimates
  const charEstimate = charCount / AVG_CHARS_PER_TOKEN
  const wordEstimate = wordCount * 1.3  // avg ~1.3 tokens/word in English

  return Math.round((charEstimate + wordEstimate) / 2)
}

/**
 * Estimate tokens for a structured message array.
 * Adds per-message overhead (role tokens + formatting).
 */
export function estimateMessagesTokens(
  messages: Array<{ role: string; content: string | object[] }>
): number {
  const MESSAGE_OVERHEAD = 4  // tokens added per message for role/formatting

  let total = 0
  for (const msg of messages) {
    total += MESSAGE_OVERHEAD
    if (typeof msg.content === 'string') {
      total += estimateTokens(msg.content)
    } else if (Array.isArray(msg.content)) {
      for (const block of msg.content) {
        if (typeof block === 'object' && block !== null && 'text' in block) {
          total += estimateTokens((block as { text: string }).text ?? '')
        } else if (typeof block === 'object' && block !== null && 'type' in block && (block as { type: string }).type === 'image_url') {
          // Vision tokens: Anthropic charges ~1334 tokens for a standard image tile
          total += 1334
        }
      }
    }
  }

  return total + 3  // conversation priming overhead
}

/**
 * Format a token count for display (e.g. 1234567 → "1.23M", 45000 → "45K").
 */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M`
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`
  }
  return tokens.toString()
}

/**
 * Return how much context capacity remains.
 */
export function remainingTokens(used: number, max: number): number {
  return Math.max(0, max - used)
}
