import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini
GEMINI_API_KEY = "AIzaSyByqui_B2PqdLZfm8AGwN7GEsKShEOpDGk"
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash-lite"
MAX_CHUNK_TOKENS = 3000  # ~12000 chars; safe chunk size for segmentation
MAX_CHARS_PER_CHUNK = 12000


def chunk_transcript(transcript: str) -> list[str]:
    """Split long transcripts into manageable chunks by paragraph/speaker boundary."""
    if len(transcript) <= MAX_CHARS_PER_CHUNK:
        return [transcript]

    chunks = []
    paragraphs = re.split(r"\n{2,}", transcript)
    current_chunk = []
    current_len = 0

    for para in paragraphs:
        if current_len + len(para) > MAX_CHARS_PER_CHUNK and current_chunk:
            chunks.append("\n\n".join(current_chunk))
            current_chunk = [para]
            current_len = len(para)
        else:
            current_chunk.append(para)
            current_len += len(para)

    if current_chunk:
        chunks.append("\n\n".join(current_chunk))

    return chunks


def call_gemini(prompt: str) -> str:
    """Call Gemini API with a prompt and return the text response."""
    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)
    return response.text.strip()


def summarize_chunk(chunk: str, chunk_index: int, total_chunks: int) -> str:
    """Summarize a single transcript chunk."""
    part_note = f" (Part {chunk_index + 1} of {total_chunks})" if total_chunks > 1 else ""
    prompt = f"""You are an expert meeting analyst. Below is a portion of a meeting transcript{part_note}.

Provide a concise summary (150-250 words) capturing:
- Key discussion points
- Decisions made
- Important outcomes or conclusions

Transcript:
\"\"\"
{chunk}
\"\"\"

Write the summary in clear, professional prose. Do not include headers or bullet points—just flowing paragraphs."""
    return call_gemini(prompt)


def synthesize_summaries(summaries: list[str]) -> str:
    """Merge chunk summaries into a final cohesive summary."""
    if len(summaries) == 1:
        return summaries[0]

    combined = "\n\n---\n\n".join(
        [f"Section {i+1}:\n{s}" for i, s in enumerate(summaries)]
    )
    prompt = f"""You are an expert meeting analyst. Below are summaries of different sections of a single meeting.

Synthesize these into one cohesive final summary of 300-500 words that:
- Highlights all major decisions and outcomes
- Captures the flow and progression of the meeting
- Avoids redundancy while preserving all key points

Section summaries:
\"\"\"
{combined}
\"\"\"

Write the final summary in clear, professional prose with natural paragraph breaks."""
    return call_gemini(prompt)


def extract_action_items(transcript: str) -> list[dict]:
    """Extract action items from the full transcript (or first large chunk)."""
    # For action items, use up to first 24000 chars to stay within limits
    text = transcript[:24000]
    prompt = f"""You are an expert meeting analyst specializing in extracting action items.

Analyze this meeting transcript and extract ALL action items, tasks, commitments, and follow-ups.

For each action item, identify:
1. The specific action to be taken
2. Who is responsible (use "Team" or "TBD" if unclear)
3. Due date (use "Not specified" if not mentioned)
4. Priority: High (urgent/critical), Medium (important but not urgent), or Low (nice to have)

Transcript:
\"\"\"
{text}
\"\"\"

Respond with ONLY a valid JSON array. Each element must have exactly these fields:
- "action": string describing what needs to be done
- "assignee": string with the responsible person/team
- "due_date": string with the due date or "Not specified"
- "priority": one of "High", "Medium", or "Low"

Example format:
[
  {{"action": "Send updated report to stakeholders", "assignee": "Sarah", "due_date": "Friday", "priority": "High"}},
  {{"action": "Schedule follow-up meeting", "assignee": "Team", "due_date": "Not specified", "priority": "Medium"}}
]

If no action items are found, return an empty array: []
Return ONLY the JSON array, no other text."""

    raw = call_gemini(prompt)

    # Strip markdown fences if present
    cleaned = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()

    # Find the JSON array
    match = re.search(r"\[.*\]", cleaned, re.DOTALL)
    if match:
        return json.loads(match.group())
    return []


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": MODEL_NAME})


@app.route("/api/process", methods=["POST"])
def process_transcript():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    transcript = data.get("transcript", "").strip()
    if not transcript:
        return jsonify({"error": "Transcript cannot be empty"}), 400

    if len(transcript) < 50:
        return jsonify({"error": "Transcript is too short to process"}), 400

    if not GEMINI_API_KEY:
        return jsonify({"error": "GEMINI_API_KEY is not configured on the server"}), 500

    try:
        # Step 1: Summarize (with chunking for long transcripts)
        chunks = chunk_transcript(transcript)
        chunk_summaries = []
        for i, chunk in enumerate(chunks):
            summary = summarize_chunk(chunk, i, len(chunks))
            chunk_summaries.append(summary)

        final_summary = synthesize_summaries(chunk_summaries)

        # Step 2: Extract action items
        action_items = extract_action_items(transcript)

        return jsonify({
            "summary": final_summary,
            "action_items": action_items,
            "chunks_processed": len(chunks),
            "word_count": len(transcript.split()),
        })

    except Exception as e:
        error_msg = str(e)
        if "API_KEY" in error_msg.upper() or "quota" in error_msg.lower():
            return jsonify({"error": f"Gemini API error: {error_msg}"}), 502
        return jsonify({"error": f"Processing failed: {error_msg}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)
