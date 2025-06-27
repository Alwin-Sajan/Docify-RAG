import { useState } from 'react';

export default function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF file first");
    const formData = new FormData();
    formData.append('pdf_file', file);

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('File uploaded and processed!');
      onUploadComplete();
    } else {
      alert('Upload failed.');
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload PDF
      </button>
    </div>
  );
}
