# MinutesMind — AI Meeting Minutes Generator

Transform raw meeting transcripts into professional summaries and prioritized action items using Google Gemini AI.

---

## Screenshots

### Home Screen
> Paste your transcript or drag & drop a `.txt` file to get started.

![Home Screen](docs/screenshots/home.png)

---

### Loading State
> While processing, the app shows a step-by-step progress indicator.

![Loading State](docs/screenshots/loading.png)

---

### Generated Summary
> A 300–500 word professional summary is generated covering key decisions and outcomes.

![Meeting Summary](docs/screenshots/summary.png)

---

### Action Items Table
> All action items are extracted with assignee, due date, and priority level.

![Action Items](docs/screenshots/action-items.png)

---

### Filtering by Priority
> Use the filter bar to view High, Medium, or Low priority items only.

![Priority Filter](docs/screenshots/filter.png)

---

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
├── docs/
│   └── screenshots/        # ← place your UI screenshots here
│       ├── home.png
│       ├── loading.png
│       ├── summary.png
│       ├── action-items.png
│       └── filter.png
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

# Windows (Command Prompt)
set GEMINI_API_KEY=your_api_key_here

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

## How to Use

### Step 1 — Input your transcript

![Home Screen](docs/screenshots/home.png)

Paste your meeting transcript directly into the text area, or drag & drop a `.txt` file onto it. You can also click **"Load Sample"** to try the app instantly with a pre-loaded example transcript.

---

### Step 2 — Generate minutes

Click the **"Generate Minutes"** button. The app will show a progress indicator while it processes your transcript.

![Loading State](docs/screenshots/loading.png)

---

### Step 3 — Read the summary

A professional 300–500 word summary appears, covering all key discussion points, decisions made, and important outcomes.

![Meeting Summary](docs/screenshots/summary.png)

Use the **Copy** button in the top right of the summary card to copy it to your clipboard.

---

### Step 4 — Review action items

All action items extracted from the transcript are shown in a table with:
- **Action** — what needs to be done
- **Assignee** — who is responsible
- **Due Date** — when it's due (if mentioned)
- **Priority** — High, Medium, or Low

![Action Items](docs/screenshots/action-items.png)

---

### Step 5 — Filter and manage

Use the **filter bar** to show only High, Medium, or Low priority items. Click the **checkbox** on any row to mark it as complete. Click **Export** to copy all action items as plain text.

![Priority Filter](docs/screenshots/filter.png)

---

### Step 6 — Start over

Click **"New transcript"** at the top of the results to go back and process another transcript.

---

## Adding Your Screenshots

1. Create a `docs/screenshots/` folder in the project root
2. Take screenshots of each screen while running the app locally
3. Save them with these exact filenames:

| Filename | What to capture |
|---|---|
| `home.png` | The initial screen with the empty text area |
| `loading.png` | The processing/loading state after clicking Generate |
| `summary.png` | The generated summary card |
| `action-items.png` | The full action items table |
| `filter.png` | The table with a priority filter active (e.g. High selected) |

> **Tip:** On Windows use `Snipping Tool` (Win+Shift+S). On Mac use `Cmd+Shift+4`. Aim for a browser window width of around 1200px for clean screenshots.

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

Returns `{"status": "ok", "model": "gemini-2.0-flash"}`.

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | *(required)* | Your Google Gemini API key |
| `PORT` | `5000` | Flask server port |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, plain CSS |
| Backend | Python 3, Flask, flask-cors |
| AI | Google Gemini 2.0 Flash |
| Fonts | Playfair Display, DM Sans, DM Mono |

---

## Development Notes

- The frontend proxies `/api/*` to `localhost:5000` via Vite's dev server
- For production, configure your web server (nginx, etc.) to proxy `/api` to Flask
- No database or authentication is required for the MVP
- All state is ephemeral — no data is persisted between sessions
- Run `python test_app.py` from the `backend/` folder to verify all logic is working
