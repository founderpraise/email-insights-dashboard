import React, { useState } from 'react';
import { FiUpload, FiFileText, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.eml')) {
      setFile(selectedFile);
      setError(null);
      setUploadStatus(null);
    } else {
      setError('Please select a valid .eml file');
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus({
        type: 'success',
        message: 'Email uploaded successfully!',
        data: response.data.parsed_data,
      });

      // Clear the file input
      setFile(null);
      e.target.reset();

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(response.data.parsed_data);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        'Failed to upload file. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <FiUpload className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Upload Email File</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            accept=".eml"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
          >
            {file ? file.name : 'Choose .eml file or drag and drop'}
          </label>
          <p className="text-sm text-gray-500 mt-2">
            Only .eml files are supported
          </p>
        </div>

        {file && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiFileText className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Selected: {file.name}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {uploadStatus && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">{uploadStatus.message}</span>
            </div>
            {uploadStatus.data && (
              <div className="mt-2 text-sm text-green-700">
                <p><strong>Subject:</strong> {uploadStatus.data.subject}</p>
                <p><strong>From:</strong> {uploadStatus.data.sender}</p>
                <p><strong>Date:</strong> {new Date(uploadStatus.data.timestamp).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            !file || isUploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </div>
          ) : (
            'Upload Email'
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm; 