# Speech-Driven Local RAG Web App
----------------------------------------------

### 1\. Overview

A local web application that listens for user speech, detects it, transcribes it, and queries a locally stored knowledge base built from uploaded PDF documents. Initial implementation is designed for single-user, local execution, with a minimal UI and no authentication.

* * *

### 2\. Functional Requirements

#### Speech Detection & Transcription

*   The browser continuously monitors microphone input using the Web Speech API for transcription and the Web Audio API for voice activity detection
*   Transcription begins automatically when speech is detected and ends after a short silence threshold (~1–2 seconds)
*   Each completed utterance is treated as a query
*   Very short or empty inputs are ignored

#### PDF Upload & Processing

*   User uploads a PDF via a UI button (PDF only, max ~20 MB)
*   Processing pipeline:
    *   Extract text with pdfplumber
    *   Split into chunks using parameters defined in a config file (chunk size, overlap)
    *   Generate embeddings with sentence-transformers (local model, downloaded on first run)
    *   Store embeddings in a local ChromaDB instance
*   The index persists across sessions

#### Query & Retrieval

*   Each transcribed utterance is embedded and used to query ChromaDB
*   The top-k most relevant chunks are returned and displayed (k configurable in config file)
*   Queries are stateless — no conversation history

* * *

### 3\. Tech Stack

**Backend** — Python / FastAPI + Uvicorn, pdfplumber, sentence-transformers, ChromaDB

**Frontend** — HTML + CSS + Vanilla JavaScript, Web Speech API, Web Audio API

* * *

### 4\. User Interface

Minimal interface with:

*   A PDF upload button
*   A pulsating circle reflecting system state: idle / listening / processing
*   Text display for the last transcribed query and retrieved results

* * *

### 5\. Configuration

A dedicated config file holds tunable parameters:

*   Chunk size and overlap
*   Top-k retrieval count
*   Silence threshold
*   Embedding model name

* * *

### 6\. Constraints

*   Runs on localhost only
*   Single user, no authentication
*   English only
*   No conversation memory
*   Embedding model is downloaded on first run; subsequent runs use the cached model
*   CPU inference is acceptable given small document sizes
