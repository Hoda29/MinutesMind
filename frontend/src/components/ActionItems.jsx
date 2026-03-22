import React, { useState } from 'react'
import './ActionItems.css'

const PRIORITY_CONFIG = {
  High: { color: 'priority-high', dot: '#c8472b' },
  Medium: { color: 'priority-medium', dot: '#b8922a' },
  Low: { color: 'priority-low', dot: '#1e6b6b' },
}

export default function ActionItems({ items }) {
  const [filter, setFilter] = useState('All')
  const [checked, setChecked] = useState({})

  const filters = ['All', 'High', 'Medium', 'Low']
  const counts = {
    All: items.length,
    High: items.filter(i => i.priority === 'High').length,
    Medium: items.filter(i => i.priority === 'Medium').length,
    Low: items.filter(i => i.priority === 'Low').length,
  }

  const visible = filter === 'All' ? items : items.filter(i => i.priority === filter)

  const handleCopyAll = () => {
    const text = items.map((item, i) =>
      `${i + 1}. ${item.action}\n   Assignee: ${item.assignee}\n   Due: ${item.due_date}\n   Priority: ${item.priority}`
    ).join('\n\n')
    navigator.clipboard?.writeText(text)
  }

  if (items.length === 0) {
    return (
      <div className="action-card" style={{ animationDelay: '0.1s' }}>
        <div className="card-header">
          <div className="card-label">
            <span className="label-number">03</span>
            <span className="label-text">Action Items</span>
          </div>
        </div>
        <div className="no-actions">
          <span>No action items identified in this transcript.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="action-card" style={{ animationDelay: '0.1s' }}>
      <div className="card-header">
        <div className="card-label">
          <span className="label-number">03</span>
          <span className="label-text">Action Items</span>
          <span className="action-count">{items.length}</span>
        </div>
        <div className="card-meta">
          <button className="copy-btn" onClick={handleCopyAll}>
            <CopyIcon /> Export
          </button>
        </div>
      </div>

      <div className="filter-bar">
        {filters.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {counts[f] > 0 && (
              <span className={`filter-count ${f !== 'All' ? `fc-${f.toLowerCase()}` : ''}`}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="actions-table">
        <div className="table-head">
          <div className="col-check" />
          <div className="col-action">Action</div>
          <div className="col-assignee">Assignee</div>
          <div className="col-due">Due Date</div>
          <div className="col-priority">Priority</div>
        </div>

        {visible.map((item, i) => {
          const key = `${filter}-${i}`
          const isChecked = checked[`${items.indexOf(item)}`]
          const config = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Low

          return (
            <div
              key={key}
              className={`table-row ${isChecked ? 'row-done' : ''}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="col-check">
                <button
                  className={`check-box ${isChecked ? 'checked' : ''}`}
                  onClick={() => setChecked(prev => ({
                    ...prev,
                    [`${items.indexOf(item)}`]: !isChecked
                  }))}
                >
                  {isChecked && <CheckIcon />}
                </button>
              </div>
              <div className="col-action">
                <span className="action-text">{item.action}</span>
              </div>
              <div className="col-assignee">
                <span className="assignee-chip">{item.assignee}</span>
              </div>
              <div className="col-due">
                <span className="due-text">{item.due_date}</span>
              </div>
              <div className="col-priority">
                <span className={`priority-badge ${config.color}`}>
                  <span className="priority-dot" style={{ background: config.dot }} />
                  {item.priority}
                </span>
              </div>
            </div>
          )
        })}
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

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
