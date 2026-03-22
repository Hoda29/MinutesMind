import React from 'react'
import './LoadingState.css'

const STEPS = [
  { id: 1, label: 'Reading transcript', detail: 'Parsing structure and speaker turns…' },
  { id: 2, label: 'Generating summary', detail: 'Identifying decisions and key outcomes…' },
  { id: 3, label: 'Extracting actions', detail: 'Finding tasks, owners, and deadlines…' },
  { id: 4, label: 'Formatting output', detail: 'Assembling your meeting minutes…' },
]

export default function LoadingState({ currentStep = 1 }) {
  return (
    <div className="loading-state">
      <div className="loading-header">
        <div className="loading-spinner">
          <svg viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="14" stroke="var(--paper-deep)" strokeWidth="2.5" />
            <circle
              cx="18" cy="18" r="14"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="22 66"
              style={{ animation: 'spin 1.2s linear infinite', transformOrigin: '18px 18px' }}
            />
          </svg>
        </div>
        <div className="loading-title">Processing Transcript</div>
      </div>

      <div className="loading-steps">
        {STEPS.map((step) => {
          const state = step.id < currentStep ? 'done' : step.id === currentStep ? 'active' : 'pending'
          return (
            <div key={step.id} className={`step step-${state}`}>
              <div className="step-indicator">
                {state === 'done' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : state === 'active' ? (
                  <span className="step-dot-active" />
                ) : (
                  <span className="step-dot" />
                )}
              </div>
              <div className="step-content">
                <div className="step-label">{step.label}</div>
                {state === 'active' && <div className="step-detail">{step.detail}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
