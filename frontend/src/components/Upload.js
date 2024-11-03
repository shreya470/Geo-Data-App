import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import './Upload.css'; // Import CSS styles

const Upload = () => {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [flag, setflag] = useState(0);
    const [loading, setLoading] = useState(false);
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFilename(selectedFile.name);
    };

    const handleUpload = async () => {
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = async (event) => {
          const fileContent = event.target.result;
          setLoading(true);
          try {
              const jsonData = JSON.parse(fileContent);
              console.log(jsonData);
              const response = await axios.post('http://localhost:3001/mymap/save', { jsonData: jsonData, name: filename });
              console.log('Data uploaded successfully');
              setflag(flag ^ 1);
          } catch (error) {
              console.error('Error uploading data:', error);
              // Display error message from response
              if (error.response && error.response.data && error.response.data.message) {
                  alert(error.response.data.message); // or use a more elegant UI approach to display errors
              } else {
                  alert('Error uploading data.'); // Fallback message
              }
          } finally {
            setLoading(false);
        }
      };
      reader.readAsText(file);
  };

    const [filenames, setFilenames] = useState([]);
    const [selectedFilename, setSelectedFilename] = useState('');

    useEffect(() => {
        fetchData();
    }, [flag]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/get-filenames'); 
            setFilenames(response.data);
        } catch (error) {
            console.error('Error fetching filenames:', error);
        }
    };

    const handleFilenameSelect = (filename) => {
        setSelectedFilename(filename);
        console.log('Selected filename:', filename);
    };

    const handleDelete = async (fileName) => {
        try {
            const response = await axios.delete('http://localhost:3001/mymap/delete', {
                data: { name: fileName },
            });
            if (response.data.success) {
                console.log(`Deleted ${fileName} successfully`);
                setflag(flag ^ 1); // Trigger fetchData to refresh the list
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
      <div className="upload-container">
          <h2 className="text-center upload-title">Upload Map Data</h2>
          <div className="file-upload">
              <label className="file-label">
                  Choose File
                  <input type="file" onChange={handleFileChange} className="file-input" />
              </label>
              <Button onClick={handleUpload} disabled={loading} className="upload-button">
                  {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Upload'}
              </Button>
              {filename && <p className="selected-filename">Selected File: {filename}</p>}
          </div>
          <div className="file-list">
              <h3 className="filenames-title">List of Filenames</h3>
              <ul>
                  {filenames.map((file, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span 
                              onClick={() => handleFilenameSelect(file.name)} 
                              className="file-name" // Existing styling for filename
                              style={{ color: "blue", textDecoration: "underline", cursor: 'pointer' }}>
                              {file.name}
                          </span>
                          <Button 
                              onClick={() => handleDelete(file.name)} 
                              variant="danger" 
                              className="delete-button" // New class for delete button
                              style={{ marginLeft: "10px" }}>
                              Delete
                          </Button>
                      </li>
                  ))}
              </ul>
              {selectedFilename && <p className="selected-filename">Selected Filename: {selectedFilename}</p>}
          </div>
          <div className="map-link">
              {selectedFilename && (
                  <Link to={`/map/${selectedFilename}`} className="show-map-button">Show Map</Link>
              )}
          </div>
      </div>
  );
};

export default Upload;