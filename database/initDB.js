import sqlite3 from "sqlite3";
import path from "path";
import { counterpartyData } from "../dataSeeding/counterpartyData.js";
import { spotTradeData } from "../dataSeeding/spotTradeData.js";
import { outrightTradeData } from "../dataSeeding/outrightTradeData.js";
import { swapTradeData } from "../dataSeeding/swapTradeData.js";

// Path to the SQLite database
const dbPath = path.resolve("./database/fx_trades.db");

// Initialize SQLite database connection
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error connecting to SQLite database:", err.message);
    } else {
      console.log("Connected to SQLite database at:", dbPath);
    }
  }
);

// Utility to run queries with Promises
const runQuery = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

// Utility to clear a table
const clearTable = async (tableName) => {
  try {
    await runQuery(`DELETE FROM ${tableName}`);
    console.log(`${tableName} table cleared.`);
  } catch (err) {
    console.error(`Error clearing ${tableName} table: ${err.message}`);
  }
};

// Function to drop existing tables
const dropTables = async () => {
  const queries = [
    "DROP TABLE IF EXISTS counterparties;",
    "DROP TABLE IF EXISTS trades;",
  ];

  for (const query of queries) {
    try {
      await runQuery(query);
      console.log(`Dropped table: ${query}`);
    } catch (err) {
      console.error(`Error dropping table: ${err.message}`);
    }
  }
};

// Function to create the `counterparties` table
const createCounterpartyTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS counterparties (
    id TEXT PRIMARY KEY,
    name TEXT,
    city TEXT,
    country TEXT,
    currency TEXT,
    accountNumber TEXT,
    nostroAccount TEXT,
    swiftCode TEXT,
    contactPerson TEXT,
    email TEXT,
    phone TEXT,
    nostroAccounts TEXT
  );`;

  try {
    await runQuery(query);
    console.log("Counterparties table created or already exists.");
    await populateCounterpartyTable();
  } catch (err) {
    console.error("Error creating counterparties table:", err.message);
  }
};

// Function to populate the `counterparties` table
const populateCounterpartyTable = async () => {
  await clearTable("counterparties");

  const insertQuery = `INSERT INTO counterparties (
    id, name, city, country, currency, accountNumber, nostroAccount, 
    swiftCode, contactPerson, email, phone, nostroAccounts
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  for (const counterparty of counterpartyData) {
    try {
      await runQuery(insertQuery, [
        counterparty.id,
        counterparty.name,
        counterparty.city,
        counterparty.country,
        counterparty.currency,
        counterparty.accountNumber,
        counterparty.nostroAccount,
        counterparty.swiftCode,
        counterparty.contactPerson,
        counterparty.email,
        counterparty.phone,
        JSON.stringify(counterparty.nostroAccounts),
      ]);
      console.log(`Inserted counterparty: ${counterparty.name}`);
    } catch (err) {
      console.error(
        `Error inserting counterparty ${counterparty.name}: ${err.message}`
      );
    }
  }
};

// Function to create the `trades` table
const createTradeTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS trades (
    tradeId TEXT PRIMARY KEY,
    tradeType TEXT,
    weBuyWeSell TEXT,
    counterpartyName TEXT,
    counterpartyId TEXT,
    tradeDate TEXT,
    buyCurrency TEXT,
    sellCurrency TEXT,
    buyAmount REAL,
    sellAmount REAL,
    exchangeRate REAL,
    settlementDate TEXT,
    nearDate TEXT,
    farDate TEXT,
    buyNostroAccount TEXT,
    sellNostroAccount TEXT,
    FOREIGN KEY (counterpartyId) REFERENCES counterparties(id)
  );`;

  try {
    await runQuery(query);
    console.log("Trades table created or already exists.");
    await populateTradeTable();
  } catch (err) {
    console.error("Error creating trades table:", err.message);
  }
};

// Function to populate the `trades` table
const populateTradeTable = async () => {
  await clearTable("trades");

  const insertQuery = `INSERT INTO trades (
    tradeId, tradeType, weBuyWeSell, counterpartyName,
    counterpartyId, tradeDate, buyCurrency, sellCurrency,
    buyAmount, sellAmount, exchangeRate, settlementDate,
    nearDate, farDate, buyNostroAccount, sellNostroAccount
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const allTrades = [...spotTradeData, ...outrightTradeData, ...swapTradeData];

  for (const trade of allTrades) {
    try {
      await runQuery(insertQuery, [
        trade.tradeId,
        trade.tradeType,
        trade.weBuyWeSell,
        trade.counterpartyName,
        trade.counterpartyId,
        trade.tradeDate,
        trade.buyCurrency,
        trade.sellCurrency,
        trade.buyAmount,
        trade.sellAmount,
        trade.exchangeRate,
        trade.settlementDate,
        trade.nearDate || null,
        trade.farDate || null,
        JSON.stringify(trade.buyNostroAccount),
        JSON.stringify(trade.sellNostroAccount),
      ]);
      console.log(`Inserted trade: ${trade.tradeId}`);
    } catch (err) {
      console.error(`Error inserting trade ${trade.tradeId}: ${err.message}`);
    }
  }
};

// Function to initialize the database
const initializeDatabase = async () => {
  console.log("Starting database initialization...");
  try {
    await dropTables();
    await createCounterpartyTable();
    await createTradeTable();
    console.log("Database initialization complete.");
  } catch (err) {
    console.error("Error during database initialization:", err.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
};

// Run initialization
initializeDatabase();
