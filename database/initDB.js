import sqlite3 from "sqlite3";
import path from "path";
import { addBusinessDays, differenceInCalendarDays, isWeekend } from "date-fns";
import { counterpartyData } from "../dataSeeding/counterpartyData.js";
import { nostroData } from "../dataSeeding/nostroData.js";
import { outrightTradeData } from "../dataSeeding/outrightTradeData.js";
import { spotTradeData } from "../dataSeeding/spotTradeData.js";
import { swapTradeData } from "../dataSeeding/swapTradeData.js";

const dbPath = path.resolve("./database/fx_trades.db");

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

// Drop existing tables and views
const dropTables = async (db) => {
  console.log("Dropping existing tables...");
  const tables = ["counterparties", "trades", "settlements"];
  for (const table of tables) {
    await executeQuery(db, `DROP TABLE IF EXISTS ${table};`);
  }
  console.log("Existing tables dropped.");
};

// Create tables
const createTables = async (db) => {
  console.log("Creating tables...");
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
      FOREIGN KEY (counterpartyId) REFERENCES counterparties(id),
      FOREIGN KEY (buyNostroAccountId) REFERENCES settlements(id),
      FOREIGN KEY (sellNostroAccountId) REFERENCES settlements(id)
    );`,
    `CREATE TABLE IF NOT EXISTS settlements (
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
  console.log("Tables created successfully.");
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

// Seed trades
const seedTrades = async (db) => {
  console.log("Seeding trades...");

  // Calculate date adjustments
  const today = getTradeDate();
  const originalTradeDate = new Date("2025-01-01");
  const dateOffset = differenceInCalendarDays(today, originalTradeDate);

  // Function to validate a trade
  const validateTrade = (trade) => {
    if (!trade.tradeId || !trade.tradeType || !trade.counterpartyId) {
      throw new Error(
        "Missing required fields: tradeId, tradeType, or counterpartyId."
      );
    }
    if (
      !trade.buyCurrency ||
      !trade.sellCurrency ||
      trade.buyAmount <= 0 ||
      trade.sellAmount <= 0
    ) {
      throw new Error(
        `Invalid trade data for tradeId '${trade.tradeId}': Invalid currency or amount.`
      );
    }
    if (
      trade.tradeType === "SWAP" &&
      trade.tradeId.endsWith("-FAR") &&
      !trade.parentTradeId
    ) {
      console.warn(
        `SWAP far leg '${trade.tradeId}' is missing a parentTradeId.`
      );
    }
  };

  // Transform trade data to adjust dates and handle SWAP legs
  const trades = [
    ...spotTradeData.map((trade) => ({
      ...trade,
      tradeDate: addBusinessDays(new Date(trade.tradeDate), dateOffset),
      settlementDate: addBusinessDays(
        new Date(trade.settlementDate),
        dateOffset
      ),
      buyNostroAccountId: `${trade.counterpartyId}-${trade.buyCurrency}`,
      sellNostroAccountId: `${trade.counterpartyId}-${trade.sellCurrency}`,
    })),
    ...outrightTradeData.map((trade) => ({
      ...trade,
      tradeDate: addBusinessDays(new Date(trade.tradeDate), dateOffset),
      settlementDate: addBusinessDays(
        new Date(trade.settlementDate),
        dateOffset
      ),
      buyNostroAccountId: `${trade.counterpartyId}-${trade.buyCurrency}`,
      sellNostroAccountId: `${trade.counterpartyId}-${trade.sellCurrency}`,
    })),
    ...swapTradeData.flatMap((trade) => [
      // Near leg of the SWAP trade
      {
        tradeId: trade.tradeId,
        tradeType: trade.tradeType,
        parentTradeId: null, // Near leg has no parent
        tradeDate: addBusinessDays(new Date(trade.tradeDate), dateOffset),
        settlementDate: addBusinessDays(
          new Date(trade.nearSettlementDate),
          dateOffset
        ),
        weBuyWeSell: trade.weBuyWeSell,
        counterpartyId: trade.counterpartyId,
        buyCurrency: trade.nearBuyCurrency,
        sellCurrency: trade.nearSellCurrency,
        buyAmount: trade.nearBuyAmount,
        sellAmount: trade.nearSellAmount,
        exchangeRate: trade.nearExchangeRate,
        buyNostroAccountId: `${trade.counterpartyId}-${trade.nearBuyCurrency}`,
        sellNostroAccountId: `${trade.counterpartyId}-${trade.nearSellCurrency}`,
      },
      // Far leg of the SWAP trade
      {
        tradeId: trade.farTradeId,
        tradeType: trade.tradeType,
        parentTradeId: trade.tradeId, // Far leg links back to near leg
        tradeDate: addBusinessDays(new Date(trade.tradeDate), dateOffset),
        settlementDate: addBusinessDays(
          new Date(trade.farSettlementDate),
          dateOffset
        ),
        weBuyWeSell: trade.weBuyWeSell === "we buy" ? "we sell" : "we buy",
        counterpartyId: trade.counterpartyId,
        buyCurrency: trade.farBuyCurrency,
        sellCurrency: trade.farSellCurrency,
        buyAmount: trade.farBuyAmount,
        sellAmount: trade.farSellAmount,
        exchangeRate: trade.farExchangeRate,
        buyNostroAccountId: `${trade.counterpartyId}-${trade.farBuyCurrency}`,
        sellNostroAccountId: `${trade.counterpartyId}-${trade.farSellCurrency}`,
      },
    ]),
  ];

  // Insert transformed trade data into the database
  for (const trade of trades) {
    try {
      validateTrade(trade); // Validate trade object

      const tradeDate = new Date(trade.tradeDate);
      const settlementDate = new Date(trade.settlementDate);

      const query = `
        INSERT OR IGNORE INTO trades (
          tradeId, tradeType, parentTradeId, tradeDate, settlementDate, weBuyWeSell,
          counterpartyId, buyCurrency, sellCurrency, buyAmount, sellAmount, exchangeRate,
          buyNostroAccountId, sellNostroAccountId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const params = [
        trade.tradeId,
        trade.tradeType,
        trade.parentTradeId || null,
        tradeDate.toISOString().split("T")[0],
        settlementDate.toISOString().split("T")[0],
        trade.weBuyWeSell,
        trade.counterpartyId,
        trade.buyCurrency,
        trade.sellCurrency,
        trade.buyAmount,
        trade.sellAmount,
        trade.exchangeRate,
        trade.buyNostroAccountId,
        trade.sellNostroAccountId,
      ];

      await executeQuery(db, query, params);
      console.log(`Trade '${trade.tradeId}' seeded successfully.`);
    } catch (error) {
      console.error(`Error for trade '${trade.tradeId}':`, error.message);
    }
  }

  console.log("Trades seeded successfully.");
};

// seed settlements
// seed settlements
const seedSettlements = async (db) => {
  console.log("Seeding settlements...");

  for (const record of nostroData) {
    const {
      compoundKey,
      counterpartyId,
      currency,
      nostroCode,
      managedById,
      description,
    } = record;

    // Validate that counterpartyId and managedById exist in the counterparties table
    const counterpartyExists = await new Promise((resolve) => {
      db.get(
        "SELECT 1 FROM counterparties WHERE id = ?",
        [counterpartyId],
        (err, row) => resolve(!err && row !== undefined)
      );
    });

    const managerExists = await new Promise((resolve) => {
      db.get(
        "SELECT 1 FROM counterparties WHERE id = ?",
        [managedById],
        (err, row) => resolve(!err && row !== undefined)
      );
    });

    if (!counterpartyExists || !managerExists) {
      console.warn(
        `Skipping invalid settlement: counterpartyId or managedById not found for ${compoundKey}`
      );
      continue;
    }

    // Insert settlement into the database
    try {
      await executeQuery(
        db,
        `INSERT OR IGNORE INTO settlements (id, counterpartyId, currency, nostroAccountId, nostroDescription, managedById)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          compoundKey,
          counterpartyId,
          currency,
          nostroCode,
          description,
          managedById,
        ]
      );
      console.log(`Seeded settlement: ${compoundKey}`);
    } catch (error) {
      console.error(
        `Error seeding settlement ${compoundKey}: ${error.message}`
      );
    }
  }

  console.log("Settlements seeded successfully.");
};

const main = async () => {
  const db = new sqlite3.Database(dbPath);

  try {
    console.log("Starting database initialization...");

    // Drop tables and views
    await dropTables(db);

    // Create tables
    await createTables(db);

    // Seed data
    await seedCounterparties(db);
    await seedTrades(db);
    await seedSettlements(db);

    console.log("Database initialization completed successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error.message);
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

main();
