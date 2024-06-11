import { app, shell, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

app.commandLine.appendSwitch('enable-transparent-visuals')
app.commandLine.appendSwitch('disable-gpu') // 添加这一行来启用透明背景

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 460,
    height: 460,
    frame: false,
    transparent: true, // 使窗口背景透明
    backgroundColor: '#00000000', // 窗口背景透明色
    show: true,
    autoHideMenuBar: true, // 隐藏菜单栏
    resizable: false, // 禁止调整窗口大小
    hasShadow: false, // 去掉窗口阴影
    movable: true, // 允许窗口移动
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.closeDevTools()
  mainWindow.setAlwaysOnTop(true)

  mainWindow.setSkipTaskbar(true) // 隐藏任务栏图标

  // 圆形化处理
  mainWindow.setAspectRatio(1)
  mainWindow.setResizable(false)
  mainWindow.on('maximize', () => {
    mainWindow.setSize(260, 260)
  })
  mainWindow.on('minimize', () => {
    mainWindow.showInactive()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const increaseWindowSize = () => {
  console.log('increaseWindowSize')
}

const decreaseWindowSize = () => {
  console.log('decreaseWindowSize')
}

let tray = null
app.whenReady().then(() => {
  tray = new Tray('D:/code/projects/vite-electron-vue3-deskComera/resources/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: '增大', click: increaseWindowSize },
    { label: '减小', click: decreaseWindowSize },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('DeskComera')
  tray.setContextMenu(contextMenu)
})
