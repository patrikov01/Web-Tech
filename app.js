const fileList = [
    'file1.txt',
    'file2.txt',
    'subdir1',
    'subdir2'
  ];
  
const fileListElement = document.getElementById('file-list');
const subdirForm = document.querySelector('form');
  
  function displayFileList() {
    const listItems = fileList.map(item => {
      if (item.startsWith('subdir')) {
        return `<li><a href="#" class="subdir">${item}</a></li>`;
      } else {
        return `<li>${item}</li>`;
      }
    });
  
    fileListElement.innerHTML = `<ul>${listItems.join('')}</ul>`;
  
    const subdirLinks = fileListElement.querySelectorAll('.subdir');
    subdirLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const subdirName = link.textContent;
        enterSubdirectory(subdirName);
      });
    });
  }
  
  function enterSubdirectory(subdirName) {
    const subdirIndex = fileList.indexOf(subdirName);
    if (subdirIndex !== -1) {
      fileList.splice(subdirIndex, 1, `${subdirName}/file1.txt`, `${subdirName}/file2.txt`);
      displayFileList();
    } else {
      alert(`Subdirectory "${subdirName}" not found`);
    }
  }  
  
  subdirForm.addEventListener('submit', event => {
    event.preventDefault();
    const subdirName = document.getElementById('subdir-name').value;
    enterSubdirectory(subdirName);
  });
  
  displayFileList();
  