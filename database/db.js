import sqlite3 from "sqlite3";
import path from "path";

// Use a relative or hardcoded path for the database file
const dbPath = path.resolve(
  "/Volumes/Stuarts Documents/fx_trader/fx_trader_server/database/fx_trades.db"
);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
  }
});

export default db;
