# CodeLens — AI-Powered GitHub Codebase Assistant

**Understand any GitHub repository through natural language conversations.**

CodeLens is an AI-powered codebase assistant that allows developers to explore, understand, and analyze GitHub repositories using natural language. Instead of manually navigating hundreds of files, developers can ask questions about a codebase and receive context-aware answers grounded in the repository's actual source code.

Built using **Retrieval-Augmented Generation (RAG)**, vector search, and large language models, CodeLens retrieves relevant code snippets before generating answers.

---

## Key Features

### 🤖 AI-Powered Codebase Chat

* Ask natural language questions about a GitHub repository.
* Understand code functionality, project structure, and implementation details.
* Generate answers using retrieved source-code context.
* View relevant source files associated with answers.

### 🔍 Retrieval-Augmented Generation (RAG)

* Ingest source files from GitHub repositories.
* Split source code into overlapping chunks for better retrieval.
* Generate vector embeddings for semantic search.
* Retrieve relevant code snippets based on user queries.
* Generate context-aware responses using an LLM.

### 🧠 Hybrid LLM Architecture

* **Ollama:** Run local language models for local inference and development.
* **Google Gemini API:** Use cloud-based language models for higher-capability responses.
* Route questions between available models based on the configured routing logic.
* Keep model integration modular so providers can be changed independently.

### 📂 Repository Management

* Add and ingest GitHub repositories.
* Track ingestion status and processing progress.
* View repository statistics, processed files, and generated chunks.
* Delete repositories and their associated stored data.

### 🗂️ Code Exploration

* Explore repository files.
* Filter retrieved code by programming language and file path.
* Inspect source references associated with AI-generated answers.

### ⚡ Asynchronous Repository Ingestion

* Process repositories without blocking the main application.
* Track ingestion progress and the currently processed file.
* Store repository metadata and processing status separately from vector embeddings.

### 🎨 Minimal Developer-Focused Interface

* Monochrome black-and-white design.
* Repository sidebar and workspace.
* Integrated file explorer and AI chat.
* Repository overview and source references.

---

## Tech Stack

| Category        | Technologies                         |
| --------------- | ------------------------------------ |
| Frontend        | React, Vite, Tailwind CSS            |
| Backend         | Node.js, Express.js                  |
| Database        | MongoDB Atlas                        |
| Vector Database | Chroma Cloud                         |
| Embeddings      | Ollama, `nomic-embed-text`           |
| Local LLM       | Ollama, `llama3.1:8b`                |
| Cloud LLM       | Google Gemini API                    |
| Code Retrieval  | Semantic vector search               |
| Architecture    | Retrieval-Augmented Generation (RAG) |
| Version Control | Git, GitHub                          |

---

## Architecture

CodeLens follows a retrieval-first architecture to ground AI responses in the actual contents of a repository.

```text
                    ┌────────────────────────┐
                    │      React Frontend    │
                    │                        │
                    │ Repository Explorer    │
                    │ AI Chat Interface      │
                    │ Progress & Sources     │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Node.js + Express    │
                    │                        │
                    │ Repository Management  │
                    │ Ingestion Pipeline     │
                    │ Chat & RAG Services    │
                    └────────────┬───────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
       ┌────────────────────┐       ┌────────────────────┐
       │   MongoDB Atlas    │       │    Chroma Cloud    │
       │                    │       │                    │
       │ Repository Metadata│       │ Code Embeddings    │
       │ Ingestion Progress │       │ Vector Retrieval   │
       └────────────────────┘       └────────────────────┘
                                               ▲
                                               │
                                    ┌──────────┴──────────┐
                                    │                     │
                                    ▼                     ▼
                          ┌────────────────┐   ┌────────────────┐
                          │ Ollama         │   │ Gemini API     │
                          │ Local Models   │   │ Cloud Models   │
                          └────────────────┘   └────────────────┘
```

### How It Works

**1. Repository Ingestion**

The user submits a GitHub repository. CodeLens processes supported source files and splits their contents into smaller, overlapping chunks.

**2. Embedding Generation**

Each code chunk is converted into a vector embedding using the configured embedding model.

**3. Vector Storage**

The embeddings and associated metadata are stored in Chroma Cloud. MongoDB Atlas stores repository metadata and ingestion progress.

**4. Semantic Retrieval**

When a user asks a question, CodeLens generates an embedding for the query and searches for relevant code chunks. Retrieval can be filtered by repository, programming language, and file path.

**5. Context-Aware Answer Generation**

The retrieved code is provided to the configured LLM, which generates a response grounded in the available repository context.

**6. Source Exploration**

The interface presents relevant source references so developers can investigate the code behind an answer.

---

## Project Structure

The project uses separate frontend and backend applications.

```text
github-rag/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── RepositoryList.jsx
│   │   │   ├── RepositoryCard.jsx
│   │   │   ├── AddRepository.jsx
│   │   │   ├── RepoHeader.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── SourceCard.jsx
│   │   │   ├── FileExplorer.jsx
│   │   │   ├── OverviewPanel.jsx
│   │   │   └── DeleteRepositoryModal.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── .gitignore
└── README.md
```

*The structure above illustrates the main application components. Adjust the directory names to match your actual repository layout.*

---

## Getting Started

### Prerequisites

Before running CodeLens, make sure you have:

* Node.js and npm installed.
* A MongoDB Atlas account and database connection string.
* A Chroma Cloud account and API credentials.
* A Google Gemini API key.
* Ollama installed if you want to use local inference.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/codelens-ai-codebase-assistant.git
cd codelens-ai-codebase-assistant
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file using the environment variables required by the backend.

Example template:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_chroma_tenant
CHROMA_DATABASE=your_chroma_database

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model

OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_CHAT_MODEL=llama3.1:8b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

**Important:** These variable names are an example template, not a guarantee of the exact names used by the current implementation. Match them to the environment variables read by your backend code. Do not commit your actual `.env` file.

### 3. Configure Ollama

If you want to use local inference, install Ollama and pull the required models:

```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

Start Ollama if it is not already running:

```bash
ollama serve
```

The default local API endpoint is:

```text
http://127.0.0.1:11434
```

Keep Ollama running while using features that depend on local inference or local embeddings.

**Note:** A deployed backend cannot automatically access Ollama running on your personal computer. Production deployments need a reachable inference service or a suitable cloud-based provider.

### 4. Start the Backend

From the backend directory, run the start script configured in `package.json`.

For example:

```bash
npm run dev
```

The backend should start on the configured port, typically `5000`.

### 5. Start the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

---

## Example Use Cases

CodeLens can help developers:

* Understand an unfamiliar codebase before contributing.
* Find where a particular function or feature is implemented.
* Trace relationships between files and modules.
* Investigate implementation details using natural language.
* Explore large repositories without manually reading every source file.
* Ask questions about retrieved code and inspect the supporting source references.

### Example Questions

```text
Give me a concise overview of this repository.

Where is user authentication implemented?

Explain how the API handles incoming requests.

Which files are responsible for database operations?

How does this component interact with the backend?

Find the implementation responsible for processing this request.
```

Answers depend on repository contents, retrieval quality, and the selected language model.

---

## Design Decisions

### Why RAG?

Sending an entire repository to an LLM is often impractical because of context-window limitations, cost, and irrelevant information.

CodeLens retrieves relevant code chunks before generating an answer, helping focus the model on the specific implementation being discussed.

### Why MongoDB Atlas and Chroma Cloud?

The application separates repository management from semantic code retrieval.

* **MongoDB Atlas** stores repository metadata and ingestion progress.
* **Chroma Cloud** stores vector embeddings and supports semantic similarity search.

This separation allows repository operations and vector retrieval to be managed independently.

### Why Support Local and Cloud LLMs?

Local inference provides an option for running models without sending every prompt to a cloud LLM provider. Cloud models provide an alternative for tasks that benefit from a different model's capabilities.

The actual availability, latency, and cost depend on the model, hardware, provider quotas, and configuration.

---

## Security Notes

* Never commit API keys, database credentials, or private environment files.
* Keep `.env` files excluded through `.gitignore`.
* Configure appropriate CORS policies and request rate limits before public deployment.
* Validate repository inputs and API requests.
* Implement authentication and authorization before exposing user-specific repositories publicly.
* Ensure users can access or delete only the repositories they are authorized to manage.
* Do not assume that a public frontend makes backend endpoints secure.

---

## Future Improvements

Potential areas for further development include:

* Google OAuth authentication.
* Per-user repository ownership and access control.
* More robust retry and fallback handling for LLM providers.
* Improved retrieval ranking and code-aware chunking.
* Better support for large repositories and ingestion failures.
* Deployment with production-ready configuration.
* Automated testing and CI/CD.
* Repository-level caching and performance optimization.

---

## Author

Developed as a personal project to explore the practical application of Retrieval-Augmented Generation, vector databases, and LLM-powered developer tools.

**Project:** CodeLens — AI-Powered GitHub Codebase Assistant

**GitHub:** [maheshallaka](https://github.com/maheshallaka27)

---

*CodeLens aims to make understanding large codebases faster, more accessible, and more interactive.*
