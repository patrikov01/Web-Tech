import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleFileUpload}>Upload</button>

      <h2>Uploaded Files:</h2>
      <ul>
        {uploadedFiles.map((filename) => (
          <li key={filename}>
            <span>{filename}</span>
            <button onClick={() => handleFileDownload(filename)}>Download</button>
            <button onClick={() => handleFileDelete(filename)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
