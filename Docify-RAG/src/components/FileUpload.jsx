import { useState } from 'react';
import { useSnackbar } from 'notistack';

export default function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleUpload = async () => {
    if (!file) return enqueueSnackbar('Select a PDF file first', { variant: 'error' });

    setLoading(true);

    const formData = new FormData();
    formData.append('pdf_file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        enqueueSnackbar('File uploaded and processed!', { variant: 'success' });
        onUploadComplete();
      } else {
        enqueueSnackbar('Upload failed.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Server error during upload.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white shadow-xl rounded-xl">
      {/* File Input */}
      <div className="flex flex-col items-center">
        <label className="text-lg font-semibold text-gray-700 mb-2" htmlFor="pdf-upload">
          Upload your PDF file
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="file:border file:border-gray-300 file:bg-gray-50 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 
          ${loading
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:scale-105'
          }`}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {loading ? 'Uploading...' : 'Upload PDF'}
      </button>

      {/* File Preview */}
      {file && (
        <div className="mt-4 text-center text-gray-600">
          <p className="font-medium">Selected file:</p>
          <p className="text-sm truncate">{file.name}</p>
        </div>
      )}
    </div>
  );
}
