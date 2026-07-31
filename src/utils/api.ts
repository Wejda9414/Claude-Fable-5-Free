import axios, { type AxiosResponse } from 'axios'
import { API_BASE_URL, ANTHROPIC_VERSION, RETRY_ATTEMPTS, RETRY_DELAY_MS } from '@/config/constants'
import type { AnthropicRequest, AnthropicError, StreamChunk } from '@/types'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Send a non-streaming request to the Anthropic Messages API.
 */
export async function sendMessage(
  apiKey: string,
  request: AnthropicRequest,
  attempt = 0
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  try {
    const response: AxiosResponse = await axios.post(
      `${API_BASE_URL}/messages`,
      { ...request, stream: false },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
          'content-type': 'application/json',
        },
        timeout: 120_000,
      }
    )

    const data = response.data
    const text: string = data.content
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { text: string }) => b.text)
      .join('')

    return {
      content: text,
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0,
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 529 && attempt < RETRY_ATTEMPTS) {
      // Overloaded — retry with backoff
      await sleep(RETRY_DELAY_MS * Math.pow(2, attempt))
      return sendMessage(apiKey, request, attempt + 1)
    }
    if (axios.isAxiosError(err) && err.response?.data) {
      const apiErr = err.response.data as AnthropicError
      throw new Error(apiErr.error?.message ?? 'Anthropic API error')
    }
    throw err
  }
}

/**
 * Stream a response from the Anthropic Messages API.
 * Calls onChunk for each text delta and onDone when the stream closes.
 */
export async function streamMessage(
  apiKey: string,
  request: AnthropicRequest,
  onChunk: (text: string) => void,
  onDone: (inputTokens: number, outputTokens: number) => void,
  onError: (message: string) => void
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ ...request, stream: true }),
    })

    if (!response.ok) {
      const err = (await response.json()) as AnthropicError
      onError(err.error?.message ?? `HTTP ${response.status}`)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      onError('No response body')
      return
    }

    const decoder = new TextDecoder()
    let inputTokens = 0
    let outputTokens = 0
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const raw = line.slice(6).trim()
        if (raw === '[DONE]') continue

        try {
          const chunk = JSON.parse(raw) as StreamChunk
          if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
            onChunk(chunk.delta.text)
          } else if (chunk.type === 'message_delta' && chunk.usage) {
            outputTokens = chunk.usage.output_tokens
          } else if (chunk.type === 'error' && chunk.error) {
            onError(chunk.error.message)
            return
          }
        } catch {
          // Malformed SSE line — skip
        }
      }
    }

    onDone(inputTokens, outputTokens)
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Network error')
  }
}
