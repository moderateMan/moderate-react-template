const { app, BrowserWindow } = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const http = require('http');
const qs = require("qs")
const os = require('os');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let server;

const initServer = () => {
    server = http.createServer(function (request, response) {
        // 定义了一个post变量，用于暂存请求体的信息
        let post = '';
        // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        //当有数据请求时触发
        request.on('data', function (data) {
            post += data;
        });
        // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        request.on('end', function () {
            //解析为post对象
            post = JSON.parse(post);
            //将对象转化为字符串
            response.writeHead(200, { 'Content-Type': 'text-plain' });
            response.end('{"status":20012312}\n');
            mainWindow.webContents.send("flightdata", post)
        });
    }).listen(8124);
}


const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        fullscreen: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile("./build/index.html");

    // mainWindow.maximize()
    mainWindow.removeMenu()
    // mainWindow.webContents.openDevTools()
    mainWindow.webContents.openDevTools({mode:'right'});
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

const initApp = () => {

    createWindow();
    initServer();

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', initApp);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
