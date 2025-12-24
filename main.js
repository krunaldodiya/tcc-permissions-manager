const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

// Enable live reload for development
if (process.argv.includes('--dev')) {
  try {
    require('electron-reload')(__dirname, {
      hardResetMethod: 'exit',
      ignore: ['node_modules/**', '*.log', 'bin/**']
    });
  } catch (e) {
    console.log('electron-reload not available, skipping live reload');
  }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff'
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle IPC call to get installed apps
ipcMain.handle('get-installed-apps', async () => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'list_installed_apps.sh');
    exec(`bash "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      const apps = stdout
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.trim());
      resolve(apps);
    });
  });
});

// Handle IPC call to check permissions for an app
ipcMain.handle('check-app-permissions', async (event, appPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'check_permissions.sh');
    exec(`bash "${scriptPath}" "${appPath}"`, (error, stdout, stderr) => {
      if (error) {
        // If error, return default permissions (both false)
        resolve({ bundleId: '', camera: false, microphone: false });
        return;
      }
      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (e) {
        resolve({ bundleId: '', camera: false, microphone: false });
      }
    });
  });
});

// Handle IPC call to get bundle ID
ipcMain.handle('get-bundle-id', async (event, appPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'get_bundle_id.sh');
    exec(`bash "${scriptPath}" "${appPath}"`, (error, stdout, stderr) => {
      if (error) {
        resolve('');
        return;
      }
      resolve(stdout.trim());
    });
  });
});

// Handle IPC call to grant/revoke camera permission
ipcMain.handle('toggle-camera-permission', async (event, appPath, grant) => {
  return new Promise((resolve, reject) => {
    const bundleIdScript = path.join(__dirname, 'get_bundle_id.sh');
    exec(`bash "${bundleIdScript}" "${appPath}"`, (error, stdout, stderr) => {
      if (error || !stdout.trim()) {
        reject(new Error('Could not get bundle ID'));
        return;
      }
      const bundleId = stdout.trim();
      const tccplusPath = path.join(__dirname, 'bin', 'tccplus');
      const action = grant ? 'add' : 'reset';
      exec(`"${tccplusPath}" ${action} Camera "${bundleId}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ success: true });
      });
    });
  });
});

// Handle IPC call to grant/revoke microphone permission
ipcMain.handle('toggle-microphone-permission', async (event, appPath, grant) => {
  return new Promise((resolve, reject) => {
    const bundleIdScript = path.join(__dirname, 'get_bundle_id.sh');
    exec(`bash "${bundleIdScript}" "${appPath}"`, (error, stdout, stderr) => {
      if (error || !stdout.trim()) {
        reject(new Error('Could not get bundle ID'));
        return;
      }
      const bundleId = stdout.trim();
      const tccplusPath = path.join(__dirname, 'bin', 'tccplus');
      const action = grant ? 'add' : 'reset';
      exec(`"${tccplusPath}" ${action} Microphone "${bundleId}"`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ success: true });
      });
    });
  });
});

