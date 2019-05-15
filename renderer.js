// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log('render', process.pid);

const { remote: { BrowserWindow }, ipcRenderer } = require('electron');

const { createWindow, CrossProcessEvent } = require('./shared');

let nestedWindow;

const buttonEl            = document.getElementById('super-button');
const contentEl           = document.getElementById('content');
const updateStateButtonEl = document.getElementById('update-state-button');

buttonEl.addEventListener('click', createNestedWindow);
updateStateButtonEl.addEventListener('click', updateSharedState);

// Async message handler
ipcRenderer.on('asynchronous-reply', (event, { payload }) => {
  console.log('asynchronous-reply', event, payload);

  switch (payload.type) {
    case CrossProcessEvent.TYPES.STATE:
      contentEl.innerHTML = JSON.stringify(payload.data, null, 2);
      break;

    default:
      console.warn('unknown event type', payload);
  }
});

// Async message sender
sendEvent('asynchronous-message', CrossProcessEvent.TYPES.GET_STATE);


function createNestedWindow () {
  nestedWindow = createWindow(BrowserWindow, function () {
    nestedWindow = null;
  })
}

function updateSharedState () {
  sendEvent('asynchronous-message', CrossProcessEvent.TYPES.UPDATE_STATE, {
    updatedBy: process.pid,
    updatedAt: Date.now(),
  })
}

function sendEvent (channel, type, data) {
  const event = new CrossProcessEvent(channel, type, data);
  ipcRenderer.send(event.channel, event);
}
