import React, { useState, useEffect } from 'react'
import TranscriptInput from './components/TranscriptInput'
import MeetingSummary from './components/MeetingSummary'
import ActionItems from './components/ActionItems'
import LoadingState from './components/LoadingState'
import { processTranscript } from './utils/api'
import './App.css'

export default function App() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingStep, setLoadingStep] = useState(1)

  // Simulate loading step progress for UX
  useEffect(() => {
    if (!isLoading) { setLoadingStep(1); return }
    const timings = [800, 2200, 4000]
    const timeouts = timings.map((delay, i) =>
      setTimeout(() => setLoadingStep(i + 2), delay)
    )
    return () => timeouts.forEach(clearTimeout)
  }, [isLoading])

  const handleSubmit = async (transcript) => {
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await processTranscript(transcript)
      setResult(data)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
  }

  return (
    <div className="app">
      {/* Decorative background */}
      <div className="bg-texture" />

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">M</span>
            <div className="logo-text">
              <span className="logo-name">MinutesMind</span>
              <span className="logo-tagline">Meeting Intelligence</span>
            </div>
          </div>
          <nav className="header-nav">
            <a href="https://github.com/Hoda29" className="nav-link" target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Powered by Gemini AI</div>
          <h1 className="hero-title">
            Transform meetings<br />
            <em>into actionable minutes</em>
          </h1>
          <p className="hero-desc">
            Paste any meeting transcript and instantly receive a professional summary
            with prioritized action items — ready to share.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="main-content">
        <div className="content-inner">

          {/* Input */}
          {!result && !isLoading && (
            <TranscriptInput onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {/* Error */}
          {error && (
            <div className="error-banner">
              <ErrorIcon />
              <div className="error-content">
                <strong>Processing failed</strong>
                <span>{error}</span>
              </div>
              <button className="error-retry" onClick={handleReset}>Try again</button>
            </div>
          )}

          {/* Loading */}
          {isLoading && <LoadingState currentStep={loadingStep} />}

          {/* Results */}
          {result && !isLoading && (
            <div className="results">
              <div className="results-header">
                <div className="results-label">
                  <SuccessIcon />
                  <span>Minutes generated successfully</span>
                </div>
                <button className="new-btn" onClick={handleReset}>
                  <NewIcon /> New transcript
                </button>
              </div>

              <MeetingSummary
                summary={result.summary}
                wordCount={result.word_count}
                chunksProcessed={result.chunks_processed}
              />

              <ActionItems items={result.action_items || []} />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <span>MinutesMind — AI-powered meeting intelligence</span>
          <span className="footer-sep">·</span>
          <span>Built with React + Flask + Gemini</span>
        </div>
      </footer>
    </div>
  )
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent)', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function SuccessIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--teal)' }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function NewIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}
