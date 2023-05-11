import React, { useState } from 'react';  // Import React and useState hook
import './App.css';  // Import App.css file
import backgroundImage from './images/clouds.jfif';  // Import the background image

function App() {  // Define a component named "App"
  const [fileList, setFileList] = useState([  // Declare state variables using useState hook
    'file1.txt',
    'file2.txt',
    'subdir1',
    'subdir2'
  ]);

  function enterSubdirectory(subdirName) {  // Define a function named "enterSubdirectory"
    const subdirIndex = fileList.indexOf(subdirName);  // Find the index of the subdirectory
    if (subdirIndex !== -1) {  // If the subdirectory is found in the fileList
      setFileList([  // Update the fileList state with new items
        ...fileList.slice(0, subdirIndex),
        `${subdirName}/file1.txt`,
        `${subdirName}/file2.txt`,
        ...fileList.slice(subdirIndex + 1)
      ]);
    } else {  // If the subdirectory is not found in the fileList
      alert(`Subdirectory "${subdirName}" not found`);  // Show an alert message
    }
  }

  return (
    <body style={{backgroundImage: `url(${backgroundImage})`}}>  // Set the background image of the body element
    <div className="App">  // Render a div element with a class name "App"
      <h1>Personal Cloud</h1>  // Render a h1 element with the text "Personal Cloud"
      <ul>  // Render an unordered list element
        {fileList.map(item => (  // Iterate over the items in the fileList array
          <li key={item}>  // Render a list item with a unique key
            {item.startsWith('subdir') ? (  // If the item starts with "subdir"
              <a href="#" onClick={() => enterSubdirectory(item)}>{item}</a>  // Render a link with an onClick event handler that calls "enterSubdirectory" function
            ) : (  // If the item is not a subdirectory
              item  // Render the item as is
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={event => {  // Render a form element with an onSubmit event handler
        event.preventDefault();  // Prevent the default form submission behavior
        const subdirName = event.target.elements.subdirName.value;  // Get the value of the input field
        enterSubdirectory(subdirName);  // Call the "enterSubdirectory" function with the subdirectory name
      }}>
        <label htmlFor="subdirName">Enter subdirectory name:</label>  // Render a label element with a text "Enter subdirectory name"
        <input type="text" id="subdirName" name="subdirName" />  // Render an input element with a type of "text" and an id/name of "subdirName"
        <button type="submit">Go</button>  // Render a button element with a type of "submit" and a text "Go"
      </form>
    </div>
    </body>
  );
}

export default App;  // Export the "App" component as a default export
