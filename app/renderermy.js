const { remote, ipcRenderer } = require('electron');
const currentWindow = remote.getcurrentWindow();
const marked = require('marked');
// let filePath = null;
let originalContent = '';
let isEdited = false;

const mainProcess = remote.require('./main');

//line 2 and 3 are using remote to access main.js from
//renderer and pull out data (possibly?)



// except line 1 (node exclusive, everything else works in browsers)

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

const updateUserInterface = isEdited => {
  // let title = 'Marky';

  // if(filePath){
  //   title = '${filePath} - ${title}';
  // }
  // currentWindow.setTitle(title);
  if (isEdited) {
    title = '${title} (Modified)';
  }
};
// a library doing our converting job
markdownView.addEventListener('keyup', event => {
  const currentContent = event.target.value;
  isEdited = currentContent !== originalContent;

  renderMarkdownToHtml(currentContent);
  updateUserInterface(currentContent !== originalContent);
});
// our event listener
openFileButton.addEventListener('click',()=>{
  mainProcess.getFileFromUser();
});

//we implemented readiing a file and displaying it onto our app for conversion here
ipcRenderer.on('file-opened', (event, file, content ) => {
  // filePath = file;
  originalContent = content;


  markdownView.value = content;
  renderMarkdownToHtml(content);
  
  //bringing our changes assoc with opened file
  updateUserInterface();
});