import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './App.css';

const Dashboard = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [fileToUpdate, setFileToUpdate] = useState(null);
    const [newFilename, setNewFilename] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const getFiles = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/uploads', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data) {
                setFiles(response.data.files);
            } else {
                alert('Failed to fetch files');
            }
        } catch (error) {
            console.error('Fetch files error', error);
            if (error.response) {
                alert(`Fetch files error: ${error.response.data.error}`);
            } else if (error.request) {
                alert('Fetch files error: No response from server');
            } else {
                alert(`Fetch files error: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        getFiles();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:3000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data) {
                alert('File uploaded successfully');
                // Refresh the list of files
                getFiles();
            } else {
                alert('File upload failed');
            }
        } catch (error) {
            console.error('File upload error', error);
            if (error.response) {
                alert(`File upload error: ${error.response.data.error}`);
            } else if (error.request) {
                alert('File upload error: No response from server');
            } else {
                alert(`File upload error: ${error.message}`);
            }
        }
    };

    const handleDelete = async (filename) => {
        try {
            const response = await axios.delete('http://localhost:3000/api/delete', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data: {
                    filename: filename
                }
            });

            if (response.data) {
                alert('File deleted successfully');
                // Refresh the list of files
                getFiles();
            } else {
                alert('File delete failed');
            }
        } catch (error) {
            console.error('File delete error', error);
            if (error.response) {
                alert(`File delete error: ${error.response.data.error}`);
            } else if (error.request) {
                alert('File delete error: No response from server');
            } else {
                alert(`File delete error: ${error.message}`);
            }
        }
    };

    const handleUpdate = async (oldFilename) => {
        if (!newFilename) {
            alert('Please enter a new filename');
            return;
        }

        try {
            const response = await axios.put('http://localhost:3000/api/rename', {
                oldFilename: oldFilename,
                newFilename: newFilename
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data) {
                alert('File updated successfully');
                // Reset new filename
                setNewFilename('');
                // Refresh the list of files
                await getFiles();
            } else {
                alert('File update failed');
            }
        } catch (error) {
            console.error('File update error', error);
            if (error.response) {
                alert(`File update error: ${error.response.data.error}`);
            } else if (error.request) {
                alert('File update error: No response from server');
            } else {
                alert(`File update error: ${error.message}`);
            }
        }
    };

    const handleDownload = async (filename) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/uploads/${filename}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'  
            });

            const downloadUrl = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('File download error', error);
            if (error.response) {
                alert(`File download error: ${error.response.data.error}`);
            } else if (error.request) {
                alert('File download error: No response from server');
            } else {
                alert(`File download error: ${error.message}`);
            }
        }
    };


    return (
        <div>
            <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" rel="stylesheet"></link>
            <h2>Dashboard</h2>
            <input type="file" onChange={handleFileChange} /> 

            <button id="upload" onClick={handleUpload}>Upload</button>
            <input type="text" placeholder="Search files..." onChange={event => setSearchTerm(event.target.value)} />
            <h3>Your files:</h3>
            <ul>
                {files.filter(file => file.originalname.toLowerCase().includes(searchTerm.toLowerCase())).map(file => (
                    <li key={file.filename}>
                        {file.originalname}
                        <button onClick={() => handleDelete(file.filename)}>Delete</button>
                        <button onClick={() => setFileToUpdate(file.filename)}>Update</button>
                        {fileToUpdate === file.filename && (
                            <div>
                                <input type="text" value={newFilename} onChange={(e) => setNewFilename(e.target.value)} />
                                <button onClick={() => handleUpdate(file.filename)}>Submit Update</button>
                            </div>
                        )}
                        <button onClick={() => handleDownload(file.filename)}>Download</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;