import React, { useState } from 'react';
import './App.css';
import backgroundImage from './images/clouds.jfif';

function App() {
  const [showFileList, setShowFileList] = useState(false);
  const [fileList, setFileList] = useState([
    'subdirectory1',
    'subdir2',
    'subdir3',
    'subdir4',
    'subdir5'
  ]);

  function enterSubdirectory(subdirName) {
    const subdirIndex = fileList.indexOf(subdirName);
    if (subdirIndex !== -1) {
      setFileList([
        ...fileList.slice(0, subdirIndex),
        `${subdirName}/file1.txt`,
        `${subdirName}/file2.txt`,
        ...fileList.slice(subdirIndex + 1)
      ]);
    } else {
      alert(`Subdirectory "${subdirName}" not found`);
    }
  }

  function handleShowFilesClick() {
    setShowFileList(true);
  }

  function handleHideFilesClick() {
    setShowFileList(false);
  }

  return (
     <div className="App">
      <h1>Personal Cloud</h1>
      {showFileList ? (
        <div>
          <button onClick={handleHideFilesClick}>Hide files</button>
          <ul>
            {fileList.map(item => (
              <li key={item}>
                {item.startsWith('subdir') ? (
                  <a href="#" onClick={() => enterSubdirectory(item)}>{item}</a>
                ) : (
                  item
                )}
                
              </li>
            ))}
          </ul>
          <form onSubmit={event => {
            event.preventDefault();
            const subdirName = event.target.elements.subdirName.value;
            enterSubdirectory(subdirName);
          }}>
            <label htmlFor="subdirName">Enter subdirectory name:</label>
            <input type="text" id="subdirName" name="subdirName" />
            <button type="submit">Expand</button>
          </form>
        </div>
      ) : (
        <button onClick={handleShowFilesClick}>My files</button>
      )}
    </div>
  );
}

export default App;
