function createWindow (BrowserWindow, onClosed) {

  // Create the browser window.
  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  newWindow.webContents.openDevTools();

  // and load the index.html of the app.
  newWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  newWindow.on('closed', function () {
    onClosed();
  });

  return newWindow;
}

module.exports.createWindow = createWindow;

class CrossProcessEvent {
  constructor (channel, type, payload) {
    if (!Object.values(CrossProcessEvent.TYPES).includes(type)) {
      console.warn(`unknown type "${type}"`);
    }

    this.channel = channel;
    this.payload = {
      type: type,
      data: payload,
    }
  }

  static TYPES = {
    STATE: 'STATE',
    GET_STATE: 'GET_STATE',
    UPDATE_STATE: 'UPDATE_STATE',
  };
}

module.exports.CrossProcessEvent = CrossProcessEvent;


