
# Speech-Driven RAG Assistant

A local web application that listens through the microphone, detects speech, transcribes it, and retrieves relevant passages from PDF documents uploaded by the user. This first iteration is hosted locally: no cloud services, no authentication, no conversation history.

---

## What It Does

1. **Listens continuously** — the app monitors the microphone and detects when the users starts and stops speaking
2. **Transcribes automatically** — each utterance is transcribed using the browser's Web Speech API
3. **Searches your documents** — the transcribed text is used to query a local vector database built from your uploaded PDFs
4. **Displays results** — the most relevant passages are shown in the UI

Uploading a PDF triggers an ingestion pipeline: text is extracted, split into overlapping chunks, converted into vector embeddings, and stored locally. The index persists across sessions.

---

## Scope & Constraints

- Runs on `localhost` only — single user, no authentication
- English language only
- No conversation memory — each utterance is an independent query
- CPU inference only — suitable for small to medium documents
- The embedding model is downloaded automatically on first run and cached locally

---

## Project Structure

```
app/
├── backend/
│   ├── main.py          # FastAPI app — defines all API routes
│   ├── ingest.py        # PDF ingestion pipeline
│   ├── retrieval.py     # Query pipeline
│   └── config.py        # Tunable parameters
├── frontend/
│   ├── index.html       # App shell and layout
│   ├── app.js           # Speech detection, transcription, API calls, UI updates
│   └── style.css        # Styles and pulsating indicator animation
└── data/                # ChromaDB persisted storage (auto-created on first run)
```

### Backend

**`main.py`**
The FastAPI application. Exposes two endpoints:
- `POST /upload` — receives a PDF file and triggers the ingestion pipeline
- `POST /query` — receives a transcribed text string and returns the top matching chunks

**`ingest.py`**
Handles everything from raw PDF to stored vectors:
- Extracts text using `pdfplumber`
- Splits text into overlapping chunks according to parameters in `config.py`
- Generates embeddings using `sentence-transformers`
- Stores embeddings and chunk text in the local ChromaDB instance under `data/`

**`retrieval.py`**
Handles query-time search:
- Embeds the incoming query text using the same model as ingestion
- Queries ChromaDB for the top-k most similar chunks
- Returns ranked results to the caller

**`config.py`**
Single source of truth for all tunable parameters:

| Parameter | Description |
|---|---|
| `CHUNK_SIZE` | Target word count per chunk |
| `CHUNK_OVERLAP` | Word overlap between consecutive chunks |
| `TOP_K` | Number of results to retrieve per query |
| `SILENCE_THRESHOLD_MS` | Milliseconds of silence before utterance is considered complete |
| `EMBEDDING_MODEL` | sentence-transformers model name |

### Frontend

**`index.html`**
Defines the page structure: upload button, status indicator, query display, and results panel.

**`app.js`**
All client-side logic:
- Uses the **Web Audio API** for voice activity detection — monitors microphone volume to detect speech start and end
- Uses the **Web Speech API** to transcribe detected speech
- Sends transcribed text to `/query` and received PDFs to `/upload` via `fetch`
- Updates the UI to reflect the current state: idle, listening, or processing

**`style.css`**
Visual styling and the pulsating circle animation that reflects the three system states.

### Data

**`data/`**
Created automatically on first run. Contains the ChromaDB collection with all chunk embeddings and their source text. Persists across sessions — uploaded documents do not need to be re-processed.

---

## Setup

### Requirements

- Python 3.9+
- A Chromium-based browser (required for Web Speech API)
- Microphone access

### Install dependencies

```bash
cd backend
pip install fastapi uvicorn pdfplumber sentence-transformers chromadb
```

### Run the server

```bash
uvicorn main:app --reload
```

Then open `frontend/index.html` in your browser.

> **Note:** On first run, the embedding model will be downloaded automatically (~90 MB). This only happens once.

---

## Usage

1. Click **Upload PDF** and select a document — wait for the confirmation message before speaking
2. Start speaking — the indicator will pulse when your voice is detected
3. After a short pause, your query is transcribed and sent automatically
4. Relevant passages from your documents appear below the indicator
