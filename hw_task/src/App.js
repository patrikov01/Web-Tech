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
  const [subdirectoryName, setSubdirectoryName] = useState('');
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folders, setFolders] = useState([]);
  const [openedFolder, setOpenedFolder] = useState('');

  useEffect(() => {
    fetchUploadedFiles();
    fetchFolders();
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
    if (newFilename === null) return;

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubdirectoryChange = (event) => {
    setSubdirectoryName(event.target.value);
  };

  const handleFolderChange = (event) => {
    const folderName = event.target.value;
    const selectedFolder = folders.find((folder) => folder.name === folderName);
    setSelectedFolder(selectedFolder);
  };
  

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    setOpenedFolder(folder.name);
  };

  const fetchFolders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/folders');
      setFolders(response.data.folders);
    } catch (error) {
      toast.error('Failed to fetch folders');
    }
  };

  const handleFolderCreate = async () => {
    if (!folderName) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/folders', {
        name: folderName,
      });

      toast.success(`Folder "${folderName}" created successfully!`);
      fetchFolders();
      setFolderName('');
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create the folder');
      }
    }
  };

  const handleFileMove = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    if (!selectedFolder) {
      toast.error('Please select a folder');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/move', {
        files: selectedFiles,
        folder: selectedFolder.name,
      });

      toast.success('Files moved successfully!');
      fetchUploadedFiles();
      setSelectedFiles([]);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to move the files');
      }
    }
  };

  const handleFileSelectChange = (event, filename) => {
    if (event.target.checked) {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, filename]);
    } else {
      setSelectedFiles((prevSelectedFiles) => prevSelectedFiles.filter((file) => file !== filename));
    }
  };

  return (
    <div className="App">
      <h1>File Manager</h1>

      <div className="upload-section">
        <h2>Upload a File</h2>
        <input type="file" onChange={handleFileSelect} />
        <button onClick={handleFileUpload}>Upload</button>
      </div>

      <div className="search-section">
        <h2>Search Files</h2>
        <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
      </div>

      <div className="file-list">
        <h2>Uploaded Files</h2>
        {uploadedFiles.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles
                .filter((file) => file.includes(searchTerm))
                .map((file, index) => (
                  <tr key={index}>
                    <td>{file}</td>
                    <td>
                      <button onClick={() => handleFileDownload(file)}>Download</button>
                      <button onClick={() => handleFileDelete(file)}>Delete</button>
                      <button onClick={() => handleFileRename(file)}>Rename</button>
                      <input
                        type="checkbox"
                        onChange={(event) => handleFileSelectChange(event, file)}
                        checked={selectedFiles.includes(file)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No files uploaded</p>
        )}
      </div>

      <div className="folder-section">
        <h2>Create Folder</h2>
        <input type="text" placeholder="Folder Name" value={folderName} onChange={handleFolderChange} />
        <button onClick={handleFolderCreate}>Create</button>
      </div>

      <div className="move-section">
        <h2>Move Files</h2>
        <div>
          <label>Select Folder:</label>
          <select value={selectedFolder ? selectedFolder.name : ''} onChange={handleFolderChange}>
            <option value="">-- Select Folder --</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.name}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Files:</label>
          {uploadedFiles.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={index}>
                    <td>{file}</td>
                    <td>
                      <input
                        type="checkbox"
                        onChange={(event) => handleFileSelectChange(event, file)}
                        checked={selectedFiles.includes(file)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No files uploaded</p>
          )}
        </div>
        <button onClick={handleFileMove}>Move</button>
      </div>

      <div className="folder-section">
        <h2>Create Folder</h2>
        <input type="text" placeholder="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
        <button onClick={handleFolderCreate}>Create</button>
      </div>

      <div className="folder-section">
        <h2>Folders</h2>
        <ul>
          {folders.map((folder) => (
            <li key={folder.name}>{folder.name}</li>
          ))}
        </ul>
      </div>
        
      </div>
    
  );
}

export default App;
