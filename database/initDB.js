import sqlite3 from "sqlite3";
import path from "path";
import { addBusinessDays, differenceInCalendarDays, isWeekend } from "date-fns";
import { counterpartyData } from "../dataSeeding/counterpartyData.js";
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
const dropTablesAndViews = async (db) => {
  console.log("Dropping existing views...");
  const views = ["settlements_view"];
  for (const view of views) {
    await executeQuery(db, `DROP VIEW IF EXISTS ${view};`);
  }
  console.log("Existing views dropped.");

  console.log("Dropping existing tables...");
  const tables = [
    "nostroAccounts",
    "nostroInstructions",
    "counterparties",
    "trades",
  ];
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
    `CREATE TABLE IF NOT EXISTS nostroAccounts (
      id TEXT NOT NULL,
      counterpartyId TEXT NOT NULL,
      currency TEXT NOT NULL,
      description TEXT,
      managedById TEXT,
      PRIMARY KEY (id, counterpartyId),
      FOREIGN KEY (counterpartyId) REFERENCES counterparties(id),
      FOREIGN KEY (managedById) REFERENCES counterparties(id)
    );`,
    `CREATE TABLE IF NOT EXISTS nostroInstructions (
      counterpartyId TEXT NOT NULL,
      currency TEXT NOT NULL,
      nostroAccountId TEXT NOT NULL,
      nostroAccountDescription TEXT,
      PRIMARY KEY (counterpartyId, currency),
      FOREIGN KEY (counterpartyId) REFERENCES counterparties(id),
      FOREIGN KEY (nostroAccountId) REFERENCES nostroAccounts(id)
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
      FOREIGN KEY (buyNostroAccountId) REFERENCES nostroAccounts(id),
      FOREIGN KEY (sellNostroAccountId) REFERENCES nostroAccounts(id)
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
  for (const counterparty of counterpartyData) {
    const query = `INSERT INTO counterparties (id, name, city, country, currency, accountNumber, swiftCode, contactPerson, email, phone)
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
    await executeQuery(db, query, params);
  }
  console.log("Counterparties seeded successfully.");
};

// Seed nostro data
const seedNostroData = async (db) => {
  console.log("Seeding nostro data...");
  for (const counterparty of counterpartyData) {
    if (counterparty.nostroAccounts) {
      for (const [currency, nostroAccountId] of Object.entries(
        counterparty.nostroAccounts
      )) {
        // Generate a unique ID by combining counterpartyId and nostroAccountId
        const uniqueId = `${counterparty.id}-${nostroAccountId}`;

        const accountQuery = `
          INSERT OR IGNORE INTO nostroAccounts (id, counterpartyId, currency, description, managedById)
          VALUES (?, ?, ?, ?, ?);
        `;
        const instructionQuery = `
          INSERT OR IGNORE INTO nostroInstructions (counterpartyId, currency, nostroAccountId, nostroAccountDescription)
          VALUES (?, ?, ?, ?);
        `;
        try {
          await executeQuery(db, accountQuery, [
            uniqueId, // Use the unique ID here
            counterparty.id,
            currency,
            `${counterparty.name} ${currency} Nostro Account`,
            counterparty.id,
          ]);
          await executeQuery(db, instructionQuery, [
            counterparty.id,
            currency,
            uniqueId, // Use the unique ID here as well
            `${counterparty.name} ${currency} Nostro Account`,
          ]);
        } catch (error) {
          console.error(
            `Error inserting nostro account '${uniqueId}':`,
            error.message
          );
        }
      }
    }
  }
  console.log("Nostro data seeded successfully.");
};

const validateTrade = (trade) => {
  const requiredFields = [
    "tradeId",
    "tradeType",
    "tradeDate",
    "settlementDate",
    "weBuyWeSell",
    "counterpartyId",
    "buyCurrency",
    "sellCurrency",
    "buyAmount",
    "sellAmount",
    "exchangeRate",
  ];

  requiredFields.forEach((field) => {
    if (!trade[field]) {
      throw new Error(
        `Missing required field: '${field}' in trade: ${JSON.stringify(trade)}`
      );
    }
  });
};

// Seed trades
const seedTrades = async (db) => {
  console.log("Seeding trades...");
  const today = getTradeDate();
  const originalTradeDate = new Date("2025-01-01");
  const dateOffset = differenceInCalendarDays(today, originalTradeDate);

  const trades = [
    ...spotTradeData.map((trade) => ({
      ...trade,
      tradeDate: addBusinessDays(new Date(trade.tradeDate), dateOffset),
      settlementDate: addBusinessDays(
        new Date(trade.settlementDate),
        dateOffset
      ),
    })),
    ...outrightTradeData.map((trade) => ({
      ...trade,
      tradeDate: addBusinessDays(new Date(trade.tradeDate), dateOffset),
      settlementDate: addBusinessDays(
        new Date(trade.settlementDate),
        dateOffset
      ),
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
        buyCurrency: trade.nearBuyCurrency, // Map to expected field
        sellCurrency: trade.nearSellCurrency, // Map to expected field
        buyAmount: trade.nearBuyAmount, // Map to expected field
        sellAmount: trade.nearSellAmount, // Map to expected field
        exchangeRate: trade.nearExchangeRate,
        buyNostroAccountId: trade.nearBuyNostroAccountId,
        sellNostroAccountId: trade.nearSellNostroAccountId,
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
        buyCurrency: trade.farBuyCurrency, // Map to expected field
        sellCurrency: trade.farSellCurrency, // Map to expected field
        buyAmount: trade.farBuyAmount, // Map to expected field
        sellAmount: trade.farSellAmount, // Map to expected field
        exchangeRate: trade.farExchangeRate,
        buyNostroAccountId: trade.farBuyNostroAccountId,
        sellNostroAccountId: trade.farSellNostroAccountId,
      },
    ]),
  ];

  for (const trade of trades) {
    try {
      validateTrade(trade); // Validate transformed trade object

      const tradeDate = new Date(trade.tradeDate);
      const settlementDate = new Date(trade.settlementDate);

      const query = `
        INSERT INTO trades (
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

// Main function
const main = async () => {
  const db = new sqlite3.Database(dbPath);
  try {
    console.log("Starting database initialization...");
    await dropTablesAndViews(db);
    await createTables(db);
    await seedCounterparties(db);
    await seedNostroData(db);
    await seedTrades(db);
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
