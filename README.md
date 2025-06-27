# 📄 Docify-RAG: Chat with Your PDFs using RAG + Gemini AI

Docify-RAG is a full-stack AI-powered chatbot that lets you upload any PDF file and ask natural language questions about its contents. It uses **Retrieval-Augmented Generation (RAG)** with **Gemini AI** to deliver accurate, contextual answers — like ChatGPT, but focused on your documents.

---

## 🚀 Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | React (Vite) + Tailwind CSS   |
| Backend     | Flask (Python)                |
| Vector DB   | FAISS                         |
| Embeddings  | Sentence Transformers         |
| LLM         | Gemini Pro (Google AI)        |
| PDF Parsing | PyPDF                         |
| Auth        | .env API key loading          |

---

## 📁 Folder Structure

```

project-root/
├── Docify-RAG/      # React frontend (Vite)
├── Server/          # Flask backend
├── .gitignore
├── package.json     # Runs both client and server

````

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/docify-rag.git
cd docify-rag
````

### 2. Install Client & Server Dependencies

```bash
# Install React client
cd Docify-RAG
npm install

# (Optional) Add Tailwind if not already:
# npx tailwindcss init -p

# Go back and create virtual environment for Flask
cd ../Server
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

Create a `.env` file in `/Server`:

```
GOOGLE_API_KEY=your_google_api_key_here
```

---

## ▶️ Run the App

At the root of the project:

```bash
npm install concurrently --save-dev
npm run dev
```

This will:

* Start Flask backend on `http://localhost:5000`
* Start React frontend on `http://localhost:5173`

---

## 🧠 How It Works

1. Upload a PDF.
2. The backend extracts, chunks, and embeds the text.
3. When you ask a question:

   * It retrieves top-k relevant chunks using FAISS
   * Then it builds a prompt using Gemini + conversation history
4. Gemini generates a natural, contextual answer.

---

## ✨ Features

* Natural chat interface
* Context-aware RAG using FAISS
* Supports any text-based PDF
* Realtime answers powered by Gemini
* Works locally, no external database needed

---

## 📦 Future Improvements

* Streamed responses (typing effect)
* File management and history
* Support for image-based PDFs (OCR)
* Multi-user authentication

---

## 📄 License

MIT License.
