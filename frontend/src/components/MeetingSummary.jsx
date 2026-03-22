import React from 'react'
import './MeetingSummary.css'

export default function MeetingSummary({ summary, wordCount, chunksProcessed }) {
  const handleCopy = () => {
    navigator.clipboard?.writeText(summary)
  }

  return (
    <div className="summary-card" style={{ animationDelay: '0.05s' }}>
      <div className="card-header">
        <div className="card-label">
          <span className="label-number">02</span>
          <span className="label-text">Meeting Summary</span>
        </div>
        <div className="card-meta">
          {chunksProcessed > 1 && (
            <span className="meta-badge">{chunksProcessed} sections</span>
          )}
          {wordCount && (
            <span className="meta-badge">{wordCount.toLocaleString()} words in</span>
          )}
          <button className="copy-btn" onClick={handleCopy} title="Copy to clipboard">
            <CopyIcon />
            Copy
          </button>
        </div>
      </div>

      <div className="summary-body">
        <div className="summary-rule" />
        <div className="summary-text">
          {summary.split('\n\n').map((paragraph, i) => (
            paragraph.trim() && <p key={i}>{paragraph.trim()}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  )
}
