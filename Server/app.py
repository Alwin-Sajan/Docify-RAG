import os
import faiss
import numpy as np
from flask import Flask, request, jsonify
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS
from pathlib import Path

print("Starting RAG Flask API...")

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Setup upload directory
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize models and global variables
embedder = SentenceTransformer('all-MiniLM-L6-v2')
model = genai.GenerativeModel('gemini-2.0-flash')
index = None
chunks = []
conversation_history = []

# Helper: Extract text from PDF
def extract_text(pdf_path):
    reader = PdfReader(pdf_path)
    text = []
    for page in reader.pages:
        content = page.extract_text()
        if content:
            text.append(content)
    return "\n".join(text)

# Helper: Chunk text
def chunk_text(text, chunk_size=500, overlap=100):
    words = text.split()
    result = []
    i = 0
    while i < len(words):
        result.append(" ".join(words[i:i+chunk_size]))
        i += chunk_size - overlap
    return result

# Helper: Build FAISS index
def build_index(text_chunks):
    embeddings = embedder.encode(text_chunks, show_progress_bar=True)
    dim = embeddings.shape[1]
    idx = faiss.IndexFlatL2(dim)
    idx.add(np.array(embeddings).astype('float32'))
    return idx, text_chunks

# Helper: Retrieve top-k chunks for a query
def retrieve(query, k=3):
    if index is None:
        return []
    q_emb = embedder.encode([query])
    D, I = index.search(np.array(q_emb).astype('float32'), k)
    return [chunks[i] for i in I[0] if i < len(chunks)]

# Helper: Generate response from Gemini
def rag_answer(query):
    retrieved_chunks = retrieve(query)
    if not retrieved_chunks:
        return "No context available. Please upload a PDF first."

    context = '\n'.join(retrieved_chunks)
    history = "\n".join([f"User: {turn['query']}\nAssistant: {turn['response']}" for turn in conversation_history])

    prompt = f"""Use the following context and conversation history to answer the question.

Context:
{context}

Conversation History:
{history}
User: {query}
Assistant:"""

    try:
        response = model.generate_content(prompt)
        answer = response.text.strip()
        conversation_history.append({'query': query, 'response': answer})
        return answer
    except Exception as e:
        return f"Failed to generate response: {str(e)}"

# API route: Health check
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "RAG Flask API is running."})

# API route: Upload PDF and build index
@app.route('/upload', methods=['POST'])
def upload_pdf():
    global index, chunks, conversation_history
    conversation_history = []

    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['pdf_file']
    if file.filename == '':
        return jsonify({'error': 'Filename is empty'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        text = extract_text(filepath)
        if not text.strip():
            return jsonify({'error': 'The uploaded PDF contains no extractable text.'}), 400
        chunks = chunk_text(text)
        index, chunks = build_index(chunks)
        return jsonify({'message': 'PDF uploaded and processed successfully', 'chunks': len(chunks)})
    except Exception as e:
        return jsonify({'error': f'Error processing PDF: {str(e)}'}), 500

# API route: Handle chat
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'Missing query'}), 400

    try:
        answer = rag_answer(data['query'])
        return jsonify({'response': answer})
    except Exception as e:
        return jsonify({'error': f'Error generating response: {str(e)}'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
