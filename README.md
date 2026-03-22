# MinutesMind — AI Meeting Minutes Generator

Transform raw meeting transcripts into professional summaries and prioritized action items using Google Gemini AI.

## Features

- **Smart Summarization** — Generates 300–500 word summaries highlighting decisions, outcomes, and discussion points
- **Action Item Extraction** — Identifies tasks with assignee, due date, and priority (High/Medium/Low)
- **Long Transcript Support** — Automatically chunks transcripts exceeding token limits and synthesizes a unified summary
- **Interactive UI** — Filter action items by priority, mark items complete, copy/export output
- **File Upload** — Drag & drop or browse for `.txt` transcript files

---

## Project Structure

```
meeting-minutes/
├── backend/
│   ├── app.py              # Flask API server
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx / App.css
│       ├── index.css
│       ├── components/
│       │   ├── TranscriptInput.jsx / .css
│       │   ├── MeetingSummary.jsx  / .css
│       │   ├── ActionItems.jsx     / .css
│       │   └── LoadingState.jsx    / .css
│       └── utils/
│           └── api.js
├── examples/
│   ├── sample_short.txt
│   ├── sample_medium.txt
│   └── example_output.md
└── README.md
```

---

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **Google Gemini API key** — Get one free at https://aistudio.google.com/app/apikey

---

## Setup & Running

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd meeting-minutes
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Set your Gemini API key:

```bash
# macOS / Linux
export GEMINI_API_KEY="your_api_key_here"

# Windows (PowerShell)
$env:GEMINI_API_KEY="your_api_key_here"
```

Start the Flask server:

```bash
python app.py
# Server runs at http://localhost:5000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### 4. Open the app

Navigate to **http://localhost:5173** in your browser.

---

## Usage

1. **Paste** a meeting transcript into the text area, or **drag & drop** a `.txt` file
2. Click **"Generate Minutes"**
3. View the generated summary and action items
4. Filter action items by priority (High / Medium / Low)
5. Click the checkbox on any action to mark it complete
6. Use the **Export** button to copy all action items as plain text

### Sample Transcript

Click **"Load Sample"** in the app to try a pre-loaded Q4 planning meeting transcript.

---

## API Reference

### `POST /api/process`

Process a transcript and return summary + action items.

**Request body:**
```json
{
  "transcript": "string (min 50 chars)"
}
```

**Response:**
```json
{
  "summary": "string",
  "action_items": [
    {
      "action": "string",
      "assignee": "string",
      "due_date": "string",
      "priority": "High | Medium | Low"
    }
  ],
  "chunks_processed": 1,
  "word_count": 523
}
```

**Error response:**
```json
{ "error": "Human-readable error message" }
```

### `GET /api/health`

Returns `{"status": "ok", "model": "gemini-1.5-flash"}`.

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | *(required)* | Your Google Gemini API key |
| `PORT` | `5000` | Flask server port |

---

## Long Transcript Handling

For transcripts exceeding ~12,000 characters (~3,000 tokens), the backend:

1. Splits the transcript at paragraph boundaries into chunks
2. Summarizes each chunk independently
3. Synthesizes all chunk summaries into one cohesive final summary
4. Extracts action items from the full transcript (up to 24,000 chars)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, plain CSS |
| Backend | Python 3, Flask, flask-cors |
| AI | Google Gemini 1.5 Flash |
| Fonts | Playfair Display, DM Sans, DM Mono |

---

## Development Notes

- The frontend proxies `/api/*` to `localhost:5000` via Vite's dev server
- For production, configure your web server (nginx, etc.) to proxy `/api` to Flask
- No database or authentication is required for the MVP
- All state is ephemeral — no data is persisted between sessions
