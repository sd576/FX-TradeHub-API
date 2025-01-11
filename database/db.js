import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current file (useful when using ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the relative path to the database file
const dbPath = path.resolve(__dirname, "../database/fx_trades.db");

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    if (process.env.NODE_ENV !== "production")
      console.log("Connected to SQLite database at:", dbPath);
  }
});

export default db;
