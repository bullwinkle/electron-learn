// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain }                    = require('electron');
const { mainBroadcastListener, default: broadcastEvent } = require('electron-ipc-broadcast');
mainBroadcastListener();

const { createWindow, CrossProcessEvent } = require('./shared');

const STATE = {
  sharedState: true,
  updatedBy: process.pid,
  updatedAt: Date.now(),
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Event handler for asynchronous incoming messages
ipcMain.on('asynchronous-message', (event, {payload: arg}) => {
  console.log('asynchronous-message', arg);

  switch (arg.type) {
    case CrossProcessEvent.TYPES.GET_STATE: {
      // Event emitter for sending asynchronous messages
      const _event = new CrossProcessEvent('asynchronous-reply', CrossProcessEvent.TYPES.STATE, STATE);
      event.sender.send(_event.channel, _event);
      break;
    }

    case CrossProcessEvent.TYPES.UPDATE_STATE: {
      // Event emitter for sending asynchronous messages
      Object.assign(STATE, arg.data);
      //event.sender.send('asynchronous-reply', new CrossProcessEvent(CrossProcessEvent.TYPES.STATE, STATE))
      const _event = new CrossProcessEvent('asynchronous-reply', CrossProcessEvent.TYPES.STATE, STATE);
      broadcastEvent(_event.channel, _event.payload);
      break;
    }

    default:
      console.warn('unknown event type', event.type);
  }
});

app.setName('My Electron app');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});


function createMainWindow () {
  mainWindow = createWindow(BrowserWindow, function () {
    mainWindow = null;
  })
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
