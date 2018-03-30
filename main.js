'use strict'

const electron = require('electron')
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
app.on('activate', function () {
// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
if (mainWindow === null) {
    createWindow()
}
})

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1000, height: 1200})
    // and load the index.html of the app.

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      }))

    mainWindow.openDevTools();

    

    // mainWindow.loadURL("https://docs.google.com/document/d/1-q6JgL9IgMSWXGaN_NZLeSl_Jh_3BD5sn8B6opj321s/edit");
    // mainWindow.openDevTools();

    // mainWindow.webContents.on('dom-ready', function() {
    //     console.log("gonna inject JS now")
    //     fs.readFile(__dirname + '/webview.js', 'utf8', function(error, data) {
    //       mainWindow.webContents.executeJavaScript(data);
    //     });
    //   });


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })
  }

app.on('ready', createWindow)