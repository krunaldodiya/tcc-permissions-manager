# macOS TCC Plus - Desktop App

A beautiful macOS desktop application built with Electron to manage microphone and camera access permissions for installed applications.

## Features

- 🎨 Modern, beautiful UI with gradient design
- 📱 Lists all installed applications from `/Applications` and `~/Applications`
- 🎤 **Microphone Permission Management** - View and toggle microphone access for any app
- 📷 **Camera Permission Management** - View and toggle camera access for any app
- ✅ **Visual Permission Status** - Checkboxes show current permission state
- 🔍 Real-time search/filter functionality
- 📋 Copy individual app paths or all apps at once
- ⚡ Fast and responsive
- 🖱️ Click any app name to copy its path to clipboard

## Requirements

- macOS 10.13 or later
- Node.js 16.x or later
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

### Development Mode
```bash
npm start
```

Or with DevTools open:
```bash
npm run dev
```

### Building for Distribution
```bash
npm run build
```

This will create a `.dmg` file in the `dist` folder that you can distribute.

## Project Structure

- `main.js` - Electron main process (handles app lifecycle and IPC)
- `index.html` - Main UI with embedded CSS and JavaScript
- `list_installed_apps.sh` - Shell script that finds installed apps
- `check_permissions.sh` - Script to check TCC permissions for an app
- `get_bundle_id.sh` - Script to extract bundle ID from app path
- `bin/tccplus` - Binary tool for managing TCC permissions
- `package.json` - Project configuration and dependencies

## Important Notes

⚠️ **System Permissions Required**: 
- The app needs Full Disk Access to read the TCC database
- Granting/revoking permissions requires appropriate system privileges
- Some system apps may not appear in the list

🔒 **Security**: 
- Modifying TCC permissions affects system security
- Only grant permissions to trusted applications
- The app uses `tccplus` to modify permissions programmatically

## How It Works

1. The Electron main process (`main.js`) handles IPC communication
2. When the app loads, it calls the shell script `list_installed_apps.sh` to find all installed apps
3. For each app, it checks TCC (Transparency, Consent, and Control) permissions using `check_permissions.sh`
4. Results are displayed in a searchable, scrollable list with checkboxes for camera and microphone
5. Users can toggle permissions by clicking the checkboxes, which uses `tccplus` to grant/revoke access
6. The app queries the TCC database to show current permission status

## Permission Management

- **Checkboxes**: Each app has two checkboxes on the right side:
  - 🎤 Microphone - Shows and controls microphone access
  - 📷 Camera - Shows and controls camera access
- **Checked** = Permission granted
- **Unchecked** = Permission not granted
- Click a checkbox to toggle the permission (requires appropriate system permissions)

## Technologies Used

- **Electron** - Cross-platform desktop app framework
- **HTML/CSS/JavaScript** - Frontend (no React needed for this simple app)
- **Bash** - Shell script for finding apps

## License

MIT

