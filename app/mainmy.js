const fs = require('fs');
//bring in the filesystem module, for ops on files!

const { app, BrowserWindow, dialog } = require('electron');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

//exports as directly an empty object is created
exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog({
        properties : ['openFile'],
        filters : [
            {name:'Markdown', extensions : ['md','mdown','markdown'] },
            { name:'Text Files', extensions:['txt', 'text']}
        ]
    })
    if(!files)
        return;
    
    const file = files[0];
    // synchronous reading; async also available but it takes a call-back
    // without toString, we return buffer

    openFile(file);
};

const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send('file-opened', file, content);
  // we pass an arbitrary descriptipon string, and all things which we want to pass alongwith
}