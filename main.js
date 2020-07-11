const { app, BrowserWindow, Menu } = require('electron');

// Set env
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;
var glo;
function createMainWindow() {
	mainWindow = new BrowserWindow({
		title: 'SYS-Admin',
		width: 800,
		height: 500,
		icon: './assets/icons/icon.png',
		resizable: true,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// if (isDev) {
	// 	mainWindow.webContents.openDevTools();
	// }

	mainWindow.loadFile('./app/index.html');
}

function createAboutWindow() {
	aboutWindow = new BrowserWindow({
		title: 'About SYS-Admin',
		width: 300,
		height: 300,
		icon: './assets/icons/icon.png',
		resizable: false,
		backgroundColor: '#333',
	});

	aboutWindow.loadFile('./app/about.html');
}

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);
	mainWindow.on('ready', () => (mainWindow = null));
});

const menu = [
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	{
		role: 'fileMenu',
	},
	...(!isMac
		? [
				{
					label: 'Help',
					submenu: [
						{
							label: 'About',
							click: createAboutWindow,
						},
					],
				},
		  ]
		: []),
	...(isDev
		? [
				{
					label: 'Developer',
					submenu: [
						{
							role: 'reload',
						},
						{
							role: 'forcereload',
						},
						{
							type: 'separator',
						},
						{
							role: 'toggledevtools',
						},
					],
				},
		  ]
		: []),
];

app.on('window-all-closed', () => {
	if (!isMac) {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});
app.allowRendererProcessReuse = true;
