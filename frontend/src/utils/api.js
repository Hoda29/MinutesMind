const API_BASE = '/api'

export async function processTranscript(transcript) {
  const response = await fetch(`${API_BASE}/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`)
  }

  return data
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`)
  return response.ok
}
