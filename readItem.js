// Modules
const {BrowserWindow} = require('electron')

// BrowserWindow
let bgItemWin

// New read item method
module.exports = (url, callback) => {
  // create new offscreen BrowserWindow
  bgItemWin = new BrowserWindow({
    width: 1000,
    height: 1000,
    show: false,
    webPreference: {
      offscreen: true
    }
  })

  // load read item
  bgItemWin.loadURL(url)

  // wait for page to finish loading
  bgItemWin.webContents.on('did-finish-load', () => {
    // get screenshot
    bgItemWin.webContents.capturePage((image) => {
      // get image as dataURL
      let screenshot = image.toDataURL()

      // get page title
      let title = bgItemWin.getTitle()

      // return new item via callback
      callback({title, screenshot, url})

      // clear up
      bgItemWin.close()
      bgItemWin = null
    })
  })


}
