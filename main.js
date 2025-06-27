const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const Firebird = require("node-firebird");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadFile("app/index.html");

  const config = JSON.parse(fs.readFileSync("config.json"));
  const aliases = fs.readFileSync("config/database.config", "utf-8");
  const aliasLine = aliases.split("\n").find(line => line.startsWith(config.databaseAlias + " ="));
  const dbPath = aliasLine ? aliasLine.split("=")[1].trim() : null;

  if (!dbPath) {
    console.log("Alias não encontrado em database.config");
    return;
  }

  const options = {
    host: dbPath.split(":")[0],
    database: dbPath.split(":")[1],
    user: config.user,
    password: config.password
  };

  Firebird.attach(options, (err, db) => {
    if (err) return console.error("Erro de conexão:", err);
    console.log("Conectado ao banco Firebird!");
    db.detach();
  });
}

app.whenReady().then(createWindow);
