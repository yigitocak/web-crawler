import { app, BrowserWindow, ipcMain } from "electron";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

// Define __dirname for ES6 modules
const __dirname = dirname(fileURLToPath(import.meta.url));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 300,
    resizable: false, // Disable window resizing
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("./src/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle crawl requests from the renderer process
ipcMain.handle("start-crawl", async (event, url) => {
  console.log(`starting crawl of ${url}`);
  const pages = await crawlPage(url, url, {});
  printReport(pages);
  return pages;
});

// Handle window control actions
ipcMain.on("window-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on("window-close", () => {
  if (mainWindow) mainWindow.close();
});
