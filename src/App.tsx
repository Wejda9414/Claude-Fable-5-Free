import React, { useState } from 'react'
import { ChatWindow } from '@/components/ChatWindow'
import { ModelSelector } from '@/components/ModelSelector'
import { PromptLibrary } from '@/components/PromptLibrary'
import { useFableChat } from '@/hooks/useFableChat'
import { getDefaultModel } from '@/config/models'
import '@/styles/globals.css'

export default function App(): React.ReactElement {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('fable5_api_key') ?? '')
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey)
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false)

  const defaultModel = getDefaultModel()

  const {
    session,
    status,
    streamingText,
    sendUserMessage,
    clearSession,
    setSystemPrompt,
    setModelId,
    abortStream,
  } = useFableChat({
    apiKey,
    modelId: defaultModel.id,
    streamingEnabled: true,
  })

  function handleApiKeySubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const key = (fd.get('apiKey') as string).trim()
    if (key) {
      localStorage.setItem('fable5_api_key', key)
      setApiKey(key)
      setShowApiKeyInput(false)
    }
  }

  function handlePromptSelect(prompt: string): void {
    setPromptLibraryOpen(false)
    void sendUserMessage(prompt)
  }

  if (showApiKeyInput) {
    return (
      <div className="api-key-screen">
        <div className="api-key-card">
          <h1>Claude Fable 5 Free Desktop</h1>
          <p>Enter your Anthropic API key to get started. Your key is stored locally and never sent anywhere except Anthropic's API.</p>
          <form onSubmit={handleApiKeySubmit}>
            <input
              name="apiKey"
              type="password"
              placeholder="sk-ant-..."
              autoComplete="off"
              required
            />
            <button type="submit">Connect</button>
          </form>
          <p className="hint">
            No API key?{' '}
            <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
              Get one free at console.anthropic.com
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header__left">
          <span className="app-logo">Fable 5</span>
          <ModelSelector
            currentModelId={session.modelId}
            onSelect={setModelId}
          />
        </div>
        <div className="app-header__right">
          <button className="btn-ghost" onClick={() => setPromptLibraryOpen(true)}>
            Prompts
          </button>
          <button className="btn-ghost" onClick={clearSession}>
            New session
          </button>
          <button className="btn-ghost btn-sm" onClick={() => setShowApiKeyInput(true)}>
            API key
          </button>
        </div>
      </header>

      <main className="app-main">
        <ChatWindow
          session={session}
          status={status}
          streamingText={streamingText}
          onSend={sendUserMessage}
          onAbort={abortStream}
          onSystemPromptChange={setSystemPrompt}
        />
      </main>

      {promptLibraryOpen && (
        <PromptLibrary
          onSelect={handlePromptSelect}
          onClose={() => setPromptLibraryOpen(false)}
        />
      )}
    </div>
  )
}
