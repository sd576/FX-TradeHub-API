import sqlite3 from "sqlite3";
import path from "path";
import { counterpartyData } from "../dataSeeding/counterpartyData.js";
import { outrightTradeData } from "../dataSeeding/outrightTradeData.js";
import { spotTradeData } from "../dataSeeding/spotTradeData.js";
import { swapTradeData } from "../dataSeeding/swapTradeData.js";

const dbPath = path.resolve("./database/fx_trades.db");

const dropTables = async (db) => {
  const tables = [
    "nostroAccounts",
    "nostroInstructions",
    "counterparties",
    "trades",
  ];
  for (const table of tables) {
    await new Promise((resolve, reject) =>
      db.run(`DROP TABLE IF EXISTS ${table};`, (err) =>
        err ? reject(err) : resolve()
      )
    );
  }
  console.log("Existing tables dropped.");
};

const createTables = async (db) => {
  await Promise.all([
    new Promise((resolve, reject) =>
      db.run(
        `
        CREATE TABLE IF NOT EXISTS counterparties (
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
        );
        `,
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("Table 'counterparties' created successfully.");
            resolve();
          }
        }
      )
    ),
    new Promise((resolve, reject) =>
      db.run(
        `
        CREATE TABLE IF NOT EXISTS nostroAccounts (
          id TEXT PRIMARY KEY,
          counterpartyId TEXT NOT NULL,
          currency TEXT NOT NULL,
          description TEXT,
          FOREIGN KEY (counterpartyId) REFERENCES counterparties(id)
        );
        `,
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("Table 'nostroAccounts' created successfully.");
            resolve();
          }
        }
      )
    ),
    new Promise((resolve, reject) =>
      db.run(
        `
        CREATE TABLE IF NOT EXISTS nostroInstructions (
          counterpartyId TEXT NOT NULL,
          currency TEXT NOT NULL,
          nostroAccountId TEXT NOT NULL,
          nostroAccountDescription TEXT,
          PRIMARY KEY (counterpartyId, currency),
          FOREIGN KEY (counterpartyId) REFERENCES counterparties(id),
          FOREIGN KEY (nostroAccountId) REFERENCES nostroAccounts(id)
        );
        `,
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("Table 'nostroInstructions' created successfully.");
            resolve();
          }
        }
      )
    ),
    new Promise((resolve, reject) =>
      db.run(
        `
        CREATE TABLE IF NOT EXISTS trades (
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
        );
        `,
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("Table 'trades' created successfully.");
            resolve();
          }
        }
      )
    ),
  ]);

  console.log("Tables created successfully.");
};

const deriveNostroId = (counterpartyId, currency) => {
  return `${counterpartyId}${currency}`;
};

const seedData = async (db) => {
  // Seed counterparties
  for (const counterparty of counterpartyData) {
    console.log(
      `Seeding counterparty: ${counterparty.id} - ${counterparty.name}`
    );
    await new Promise((resolve, reject) =>
      db.run(
        `INSERT INTO counterparties (id, name, city, country, currency, accountNumber, swiftCode, contactPerson, email, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
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
        ],
        (err) => {
          if (err) {
            console.error(
              `Error seeding counterparty ${counterparty.id} (${counterparty.name}): ${err.message}`
            );
            reject(err);
          } else {
            console.log(
              `Successfully seeded counterparty ${counterparty.id} (${counterparty.name}).`
            );
            resolve();
          }
        }
      )
    );
  }

  // Seed nostroAccounts and nostroInstructions
  for (const counterparty of counterpartyData) {
    if (counterparty.nostroAccounts) {
      for (const [currency] of Object.entries(counterparty.nostroAccounts)) {
        const nostroId = `${counterparty.id}${currency}`;
        await new Promise((resolve, reject) =>
          db.run(
            `
              INSERT INTO nostroAccounts (id, counterpartyId, currency, description)
              VALUES (?, ?, ?, ?);
              `,
            [
              nostroId,
              counterparty.id,
              currency,
              `${counterparty.name} - ${currency}`,
            ],
            (err) => {
              if (err) {
                console.error(
                  `Error seeding nostroAccounts ${counterparty.id} (${counterparty.name}): ${err.message}`
                );
                reject(err);
              } else {
                console.log(
                  `Successfully seeded nostroAccounts ${counterparty.id} (${counterparty.name}).`
                );
                resolve();
              }
            }
          )
        );

        await new Promise((resolve, reject) =>
          db.run(
            `
              INSERT INTO nostroInstructions (counterpartyId, currency, nostroAccountId, nostroAccountDescription)
              VALUES (?, ?, ?, ?);
              `,
            [
              counterparty.id,
              currency,
              nostroId,
              `${counterparty.name} handles ${currency}`,
            ],
            (err) => {
              if (err) {
                console.error(
                  `Error seeding nostroInstructions ${counterparty.id} (${counterparty.name}): ${err.message}`
                );
                reject(err);
              } else {
                console.log(
                  `Successfully seeded nostroInstructions ${counterparty.id} (${counterparty.name}).`
                );
                resolve();
              }
            }
          )
        );
      }
    }
  }

  // Seed trades
  const allTrades = [
    ...spotTradeData,
    ...outrightTradeData,
    ...swapTradeData.flatMap((trade) => [
      {
        tradeId: trade.tradeId,
        tradeType: trade.tradeType,
        parentTradeId: null,
        tradeDate: trade.tradeDate,
        settlementDate: trade.nearSettlementDate,
        weBuyWeSell: trade.weBuyWeSell,
        counterpartyId: trade.counterpartyId,
        buyCurrency: trade.nearBuyCurrency,
        sellCurrency: trade.nearSellCurrency,
        buyAmount: trade.nearBuyAmount,
        sellAmount: trade.nearSellAmount,
        exchangeRate: trade.nearExchangeRate,
        buyNostroAccountId:
          trade.nearBuyNostroAccountId ||
          deriveNostroId(trade.counterpartyId, trade.nearBuyCurrency),
        sellNostroAccountId:
          trade.nearSellNostroAccountId ||
          deriveNostroId(trade.counterpartyId, trade.nearSellCurrency),
      },
      {
        tradeId: trade.farTradeId,
        tradeType: trade.tradeType,
        parentTradeId: trade.tradeId,
        tradeDate: trade.tradeDate,
        settlementDate: trade.farSettlementDate,
        weBuyWeSell: trade.weBuyWeSell === "we buy" ? "we sell" : "we buy",
        counterpartyId: trade.counterpartyId,
        buyCurrency: trade.farBuyCurrency,
        sellCurrency: trade.farSellCurrency,
        buyAmount: trade.farBuyAmount,
        sellAmount: trade.farSellAmount,
        exchangeRate: trade.farExchangeRate,
        buyNostroAccountId:
          trade.farBuyNostroAccountId ||
          deriveNostroId(trade.counterpartyId, trade.farBuyCurrency),
        sellNostroAccountId:
          trade.farSellNostroAccountId ||
          deriveNostroId(trade.counterpartyId, trade.farSellCurrency),
      },
    ]),
  ];

  for (const trade of allTrades) {
    if (!trade.settlementDate) {
      console.warn(
        `Skipping trade ${trade.tradeId} due to missing settlementDate.`
      );
      continue;
    }

    await new Promise((resolve, reject) =>
      db.run(
        `
          INSERT INTO trades (
            tradeId, tradeType, parentTradeId, tradeDate, settlementDate, weBuyWeSell,
            counterpartyId, buyCurrency, sellCurrency, buyAmount, sellAmount, exchangeRate,
            buyNostroAccountId, sellNostroAccountId
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `,
        [
          trade.tradeId,
          trade.tradeType,
          trade.parentTradeId,
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
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Successfully created trade number ${trade.tradeId}.`);
            resolve();
          }
        }
      )
    );
  }

  console.log("Initial data seeded.");
};

const main = async () => {
  const db = new sqlite3.Database(dbPath);

  try {
    await dropTables(db);
    await createTables(db);
    await seedData(db);
  } catch (error) {
    console.error("Error during initialization:", error.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing database connection:", err.message);
      } else {
        console.log("Database connection closed.");
      }
    });
  }
};

main();
