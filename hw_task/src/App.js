import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch("/api/uploads")
      .then(res => res.json())
      .then(data => setUploadedFiles(data));
    //fetchUploadedFiles();
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      fetchUploadedFiles();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to upload the file');
      }
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/uploads');
      setUploadedFiles(response.data.files);
    } catch (error) {
      toast.error('Failed to fetch uploaded files');
    }
  };

  const handleFileDownload = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/uploads/${filename}`, {
        responseType: 'blob',
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download the file');
    }
  };

  const handleFileDelete = async (filename) => {
    try {
      await axios.delete('http://localhost:3001/api/delete', {
        data: { filename },
      });

      toast.success(`File "${filename}" deleted successfully!`);
      fetchUploadedFiles();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete the file');
      }
    }
  };

  const handleFileRename = async (oldFilename) => {
    const newFilename = prompt('Enter the new file name:', oldFilename);
    if (newFilename === null) return; // User canceled

    try {
      await axios.put('http://localhost:3001/api/rename', {
        oldFilename,
        newFilename,
      });

      toast.success(`File "${oldFilename}" renamed to "${newFilename}"`);
      fetchUploadedFiles();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to rename the file');
      }
    }
  };

  const filteredFiles = uploadedFiles.filter((filename) =>
    filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1 className="header">Personal Cloud</h1>
      <div className="file-upload">
        <input type="file" onChange={handleFileSelect} />
        <button onClick={handleFileUpload}>Upload</button>
      </div>

      <h2>Uploaded Files:</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button onClick={() => setShowFiles(!showFiles)}>
        {showFiles ? 'Hide Files' : 'Show Files'}
      </button>

      {showFiles && (
        <ul className="file-list">
          {filteredFiles.map((filename) => (
            <li key={filename}>
              <span>{filename}</span>
              <div className="file-actions">
                <button onClick={() => handleFileDownload(filename)}>Download</button>
                <button onClick={() => handleFileDelete(filename)}>Delete</button>
                <button onClick={() => handleFileRename(filename)}>Rename</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
