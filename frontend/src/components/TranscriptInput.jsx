import React, { useState, useRef } from 'react'
import './TranscriptInput.css'

const SAMPLE_TRANSCRIPT = `Date: October 15, 2024
Meeting: Q4 Product Roadmap Planning
Attendees: Sarah Chen (PM), Marcus Webb (Engineering Lead), Priya Nair (Design), Tom Okafor (Sales), Lisa Huang (Marketing)

Sarah: Alright everyone, let's get started. Today we need to finalize the Q4 roadmap and make some key decisions about our upcoming feature releases. Marcus, can you kick us off with an engineering update?

Marcus: Sure. So we've completed about 80% of the authentication overhaul. The remaining work is mainly around the SSO integration—we're targeting completion by end of next week. One thing I want to flag is that we'll need an extra two weeks for thorough QA, so final release would be November 1st at the earliest.

Sarah: Got it. That actually aligns well with our planned announcement. Tom, how's the sales side looking?

Tom: We have three enterprise clients—Globex, Initech, and Umbrella Corp—all waiting on the SSO feature specifically. Globex has been really vocal; they said if we can't deliver by November 15th, they might look at competitors. So November 1st works, but we have zero buffer.

Sarah: Okay. Marcus, I need you to send me a risk assessment document by Thursday so we can communicate realistic timelines to Tom's team. 

Marcus: Will do.

Priya: Can I jump in? I've been working on the new dashboard redesign. I've finished the mockups and they're ready for review. I'd like to schedule a design review session with Marcus and Sarah before we move to implementation.

Sarah: Absolutely. Let's do that Wednesday afternoon. Marcus, does 2pm work for you?

Marcus: Wednesday at 2 works fine.

Sarah: Great. Priya, please send the mockup files to the team Slack channel by Tuesday evening so we can all preview before the session.

Lisa: On the marketing side, I want to discuss the Q4 campaign. We're planning a major push around the SSO launch, but I need the feature specs finalized so I can create accurate messaging. Can I get a one-pager from engineering?

Marcus: I can have that ready by next Friday.

Sarah: Lisa, once you have that, what's your timeline for the campaign materials?

Lisa: We'd need about two weeks to produce everything—blog post, social assets, email sequences. So if I get the spec by November 1st, we're looking at a November 15th campaign launch.

Tom: Perfect, that gives us something concrete to tell Globex.

Sarah: One more item—our pricing. We've been debating whether to introduce tiered pricing for Q1. Tom, you mentioned last week that enterprise clients are pushing back on the current flat model.

Tom: Yes, consistently. I'd recommend we move to a three-tier structure: Starter, Professional, and Enterprise. I can prepare a detailed proposal with suggested price points.

Sarah: Let's make that a priority. Tom, can you have a draft proposal ready for the next leadership meeting on October 25th?

Tom: I'll have it ready by the 23rd so everyone has time to review beforehand.

Sarah: Wonderful. Alright, let's wrap up. To summarize action items: Marcus sends risk assessment to Sarah by Thursday, Priya sends mockups to Slack by Tuesday, design review is Wednesday at 2pm, Marcus prepares engineering one-pager for Lisa by November 1st, and Tom drafts the pricing proposal by October 23rd. Any questions?

[No further questions]

Sarah: Great meeting everyone. Thanks for your time.`

export default function TranscriptInput({ onSubmit, isLoading }) {
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0

  const handleSubmit = () => {
    if (!transcript.trim()) {
      setError('Please enter or upload a meeting transcript.')
      return
    }
    if (transcript.trim().length < 50) {
      setError('Transcript is too short. Please provide a more complete transcript.')
      return
    }
    setError('')
    onSubmit(transcript)
  }

  const handleFileUpload = (file) => {
    if (!file) return
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      setError('Only .txt files are supported.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setTranscript(e.target.result)
      setError('')
    }
    reader.onerror = () => setError('Failed to read file.')
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const loadSample = () => {
    setTranscript(SAMPLE_TRANSCRIPT)
    setError('')
  }

  return (
    <div className="input-section">
      <div className="input-header">
        <div className="input-label">
          <span className="label-number">01</span>
          <span className="label-text">Paste or Upload Transcript</span>
        </div>
        <button className="sample-btn" onClick={loadSample} disabled={isLoading}>
          Load Sample
        </button>
      </div>

      <div
        className={`textarea-wrapper ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <textarea
          className="transcript-textarea"
          value={transcript}
          onChange={(e) => { setTranscript(e.target.value); setError('') }}
          placeholder="Paste your meeting transcript here, or drag & drop a .txt file…"
          disabled={isLoading}
          spellCheck={false}
        />
        {isDragging && (
          <div className="drop-overlay">
            <span>Drop .txt file here</span>
          </div>
        )}
      </div>

      <div className="input-footer">
        <div className="footer-left">
          {wordCount > 0 && (
            <span className="word-count">{wordCount.toLocaleString()} words</span>
          )}
          {error && <span className="error-msg">{error}</span>}
        </div>
        <div className="footer-right">
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <UploadIcon />
            Upload .txt
          </button>
          <button
            className="process-btn"
            onClick={handleSubmit}
            disabled={isLoading || !transcript.trim()}
          >
            {isLoading ? (
              <><SpinnerIcon /> Processing…</>
            ) : (
              <><ProcessIcon /> Generate Minutes</>
            )}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}

function ProcessIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
    </svg>
  )
}
