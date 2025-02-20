import sqlite3 from "sqlite3";
import path from "path";
import { addBusinessDays, isWeekend } from "date-fns";
import { counterpartyData } from "../dataSeeding/counterpartyData.js";
import { nostroData } from "../dataSeeding/nostroData.js";
import { allTradesData } from "../dataSeeding/allTradeData.js";

// Helper function: Determine a valid trade date
const getTradeDate = () => {
  const today = new Date();
  return isWeekend(today)
    ? today.getDay() === 6
      ? addBusinessDays(today, -1)
      : addBusinessDays(today, 1)
    : today;
};

// General query executor
const executeQuery = (db, query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, (err) => (err ? reject(err) : resolve()));
  });

// Drop existing tables
const dropTables = async (db) => {
  console.log("🗑 Dropping existing tables...");
  const tables = ["counterparties", "trades", "nostroAccounts"];
  for (const table of tables) {
    await executeQuery(db, `DROP TABLE IF EXISTS ${table};`);
  }
  console.log("✅ Existing tables dropped.");
};

// ===========================

// Create tables
const createTables = async (db) => {
  console.log("📦 Creating tables...");
  const tableDefinitions = [
    `CREATE TABLE IF NOT EXISTS counterparties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT,
      country TEXT,
      currency TEXT NOT NULL,
      accountNumber TEXT,
      swiftCode TEXT,
      contactPerson TEXT,
      email TEXT,
      phone TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS trades (
      tradeId TEXT PRIMARY KEY,
      tradeType TEXT NOT NULL,
      parentTradeId TEXT,
      tradeDate TEXT NOT NULL,
      settlementDate TEXT NOT NULL,
      weBuyWeSell TEXT NOT NULL,
      counterpartyId TEXT NOT NULL,
      buyCurrency TEXT NOT NULL,
      sellCurrency TEXT NOT NULL,
      buyAmount REAL NOT NULL,
      sellAmount REAL NOT NULL,
      exchangeRate REAL NOT NULL,
      buyNostroAccountId TEXT,
      sellNostroAccountId TEXT,
      buyNostroDescription TEXT,  -- ✅ Restored missing field
      sellNostroDescription TEXT, -- ✅ Restored missing field
      FOREIGN KEY (counterpartyId) REFERENCES counterparties(id),
      FOREIGN KEY (buyNostroAccountId) REFERENCES nostroAccounts(id),
      FOREIGN KEY (sellNostroAccountId) REFERENCES nostroAccounts(id)
    );`,
    `CREATE TABLE IF NOT EXISTS nostroAccounts (
      id TEXT PRIMARY KEY,
      counterpartyId TEXT NOT NULL,
      currency TEXT NOT NULL,
      nostroAccountId TEXT,
      nostroDescription TEXT,
      managedById TEXT NOT NULL,
      FOREIGN KEY (counterpartyId) REFERENCES counterparties(id),
      FOREIGN KEY (managedById) REFERENCES counterparties(id)
    );`,
  ];

  for (const definition of tableDefinitions) {
    await executeQuery(db, definition);
  }
  console.log("✅ Tables created successfully.");
};

// Seed counterparties
const seedCounterparties = async (db) => {
  console.log("Seeding counterparties...");

  // Helper function to validate counterparty data
  const validateCounterparty = (counterparty) => {
    return (
      counterparty.id &&
      counterparty.name &&
      counterparty.currency &&
      typeof counterparty.id === "string" &&
      typeof counterparty.name === "string" &&
      typeof counterparty.currency === "string"
    );
  };

  for (const counterparty of counterpartyData) {
    if (!validateCounterparty(counterparty)) {
      console.error(
        `Invalid counterparty data, skipping: ${JSON.stringify(counterparty)}`
      );
      continue;
    }

    const query = `INSERT OR IGNORE INTO counterparties (id, name, city, country, currency, accountNumber, swiftCode, contactPerson, email, phone)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
      counterparty.id,
      counterparty.name,
      counterparty.city,
      counterparty.country,
      counterparty.currency,
      counterparty.accountNumber,
      counterparty.swiftCode,
      counterparty.contactPerson,
      counterparty.email,
      counterparty.phone,
    ];

    try {
      await executeQuery(db, query, params);
      console.log(`Successfully inserted counterparty: ${counterparty.id}`);
    } catch (error) {
      console.error(
        `Error inserting counterparty ${counterparty.id}: ${error.message}`
      );
    }
  }

  console.log("Counterparties seeded successfully.");
};

// 📥 Seed trades from `allTradesData.js`
const seedTrades = async (db) => {
  console.log("🌍 Seeding trades from allTradesData.js...");

  for (const trade of allTradesData) {
    try {
      const query = `
        INSERT OR IGNORE INTO trades (
          tradeId, tradeType, parentTradeId, tradeDate, settlementDate, weBuyWeSell,
          counterpartyId, buyCurrency, sellCurrency, buyAmount, sellAmount, exchangeRate,
          buyNostroAccountId, sellNostroAccountId, buyNostroDescription, sellNostroDescription
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const params = [
        trade.tradeId,
        trade.tradeType,
        trade.parentTradeId || null,
        trade.tradeDate,
        trade.settlementDate,
        trade.weBuyWeSell,
        trade.counterpartyId,
        trade.buyCurrency,
        trade.sellCurrency,
        trade.buyAmount,
        trade.sellAmount,
        trade.exchangeRate,
        trade.buyNostroAccountId,
        trade.sellNostroAccountId,
        trade.buyNostroDescription || "Unknown",
        trade.sellNostroDescription || "Unknown",
      ];

      await executeQuery(db, query, params);
      console.log(`✅ Trade '${trade.tradeId}' inserted.`);
    } catch (error) {
      console.error(
        `❌ Error inserting trade '${trade.tradeId}':`,
        error.message
      );
    }
  }

  console.log("✅ All trades seeded successfully from allTradesData.js.");
};

// 🌍 Define a mapping of which bank manages which currency
const currencyManagers = {
  USD: "010", // USD -> Bank of America (example)
  EUR: "016", // EUR -> Deutsche Bank
  GBP: "001", // GBP -> Barclays Bank
  JPY: "036", // JPY -> Mizuho Bank
  AUD: "026", // AUD -> Commonwealth Bank of Australia
  NZD: "034", // NZD -> Westpac New Zealand
  CAD: "037", // CAD -> Royal Bank of Canada
};

// 🌍 Seed nostroAccounts
const seedNostros = async (db) => {
  console.log("Seeding nostroAccounts...");

  for (const record of nostroData) {
    const {
      compoundKey,
      counterpartyId,
      currency,
      nostroCode,
      managedById: providedManagedById,
      description,
    } = record;

    console.log(
      `🔎 Checking nostro account: ${compoundKey} (Counterparty: ${counterpartyId}, Currency: ${currency})`
    );

    // 🔎 Validate counterpartyId exists
    const counterpartyExists = await new Promise((resolve) => {
      db.get(
        "SELECT 1 FROM counterparties WHERE id = ?",
        [counterpartyId],
        (err, row) => resolve(!err && row !== undefined)
      );
    });

    if (!counterpartyExists) {
      console.warn(
        `❌ Skipping nostro: Counterparty ${counterpartyId} does not exist.`
      );
      continue;
    }

    // 🔎 Assign correct `managedById` (fallback to the currency manager if missing)
    let correctedManagedById = providedManagedById;
    if (!correctedManagedById || !currencyManagers[currency]) {
      correctedManagedById = currencyManagers[currency]; // Don't use "UNKNOWN" unless absolutely necessary
      console.warn(
        `⚠️ Warning: managedById missing for ${compoundKey}. Assigned default bank for ${currency}: ${correctedManagedById}`
      );
    }

    // 🔎 Validate `managedById` exists
    const managerExists = await new Promise((resolve) => {
      db.get(
        "SELECT 1 FROM counterparties WHERE id = ?",
        [correctedManagedById],
        (err, row) => resolve(!err && row !== undefined)
      );
    });

    if (!managerExists) {
      console.warn(
        `❌ Skipping nostro: managedById '${correctedManagedById}' does not exist for ${compoundKey}.`
      );
      continue;
    }

    // 🟢 Insert nostro into the database
    try {
      console.log(
        `✅ Inserting: id=${compoundKey}, counterpartyId=${counterpartyId}, currency=${currency}, nostroAccountId=${nostroCode}, nostroDescription=${description}, managedById=${correctedManagedById}`
      );
      await executeQuery(
        db,
        `INSERT OR IGNORE INTO nostroAccounts (id, counterpartyId, currency, nostroAccountId, nostroDescription, managedById)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          compoundKey,
          counterpartyId,
          currency,
          nostroCode,
          description,
          correctedManagedById,
        ]
      );
    } catch (error) {
      console.error(`❌ Error seeding nostro ${compoundKey}: ${error.message}`);
    }
  }

  console.log("✅ Nostro Accounts seeded successfully.");
};

// 🚀 Main function to run the full database initialization
const main = async () => {
  const db = new sqlite3.Database("./database/fx_trades.db");

  try {
    console.log("🔄 Starting full database initialization...");

    await dropTables(db);
    await createTables(db);
    await seedCounterparties(db);
    await seedNostros(db);
    await seedTrades(db);

    console.log("✅ Database initialization completed successfully.");
  } catch (error) {
    console.error("❌ Error during database initialization:", error.message);
  } finally {
    db.close((err) => {
      if (err) console.error("❌ Error closing database:", err.message);
      else console.log("📁 Database connection closed.");
    });
  }
};

// 🚀 Run the main function
main();
