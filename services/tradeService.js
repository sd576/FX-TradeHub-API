import db from "../database/db.js";
import { format } from "date-fns"; // Install with: npm install date-fns

// Utility to format dates to 'YYYY-MM-DD'
const formatDate = (date) => {
  if (!date) return null;
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : format(parsedDate, "yyyy-MM-dd");
};

/**
 * Fetch all trades.
 */
export const getAllTrades = () => {
  const query = "SELECT * FROM trades";
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching trades:", err.message);
        reject(new Error("Failed to fetch trades"));
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Fetch trades for a specific counterparty.
 */
export const getTradesByCounterparty = (counterpartyId) => {
  const query = "SELECT * FROM trades WHERE counterpartyId = ?";
  return new Promise((resolve, reject) => {
    db.all(query, [counterpartyId], (err, rows) => {
      if (err) {
        console.error(
          `Error fetching trades for counterparty ${counterpartyId}:`,
          err.message
        );
        reject(new Error("Failed to fetch trades by counterparty"));
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Fetch trades by date range.
 */
export const getTradesByDateRange = (startDate, endDate) => {
  const query = "SELECT * FROM trades WHERE tradeDate BETWEEN ? AND ?";
  return new Promise((resolve, reject) => {
    db.all(query, [startDate, endDate], (err, rows) => {
      if (err) {
        console.error("Error fetching trades by date range:", err.message);
        reject(new Error("Failed to fetch trades by date range"));
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Fetch a single trade by ID.
 */
export const getTradeById = (tradeId) => {
  const query = "SELECT * FROM trades WHERE tradeId = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [tradeId], (err, row) => {
      if (err) {
        console.error(`Error fetching trade ${tradeId}:`, err.message);
        reject(new Error("Failed to fetch trade by ID"));
      } else {
        resolve(row || null);
      }
    });
  });
};

/**
 * Fetch trades by criteria.
 */
export const getTradesByCriteria = (criteria) => {
  const { buyCurrency, sellCurrency, exchangeRate } = criteria;
  let query = "SELECT * FROM trades WHERE 1=1";
  const params = [];

  if (buyCurrency) {
    query += " AND buyCurrency = ?";
    params.push(buyCurrency);
  }
  if (sellCurrency) {
    query += " AND sellCurrency = ?";
    params.push(sellCurrency);
  }
  if (exchangeRate) {
    query += " AND exchangeRate = ?";
    params.push(exchangeRate);
  }

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error("Error fetching trades by criteria:", err.message);
        reject(new Error("Failed to fetch trades by criteria"));
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Insert a new trade.
 */
export const insertTrade = async (trade) => {
  try {
    const existingTrade = await getTradeById(trade.tradeId);
    if (existingTrade) {
      throw new Error(`Trade with ID '${trade.tradeId}' already exists.`);
    }

    const query = `
      INSERT INTO trades (
        tradeId, tradeType, parentTradeId, tradeDate, settlementDate, weBuyWeSell,
        counterpartyId, buyCurrency, sellCurrency, buyAmount, sellAmount, exchangeRate,
        buyNostroAccountId, sellNostroAccountId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      trade.tradeId,
      trade.tradeType,
      trade.parentTradeId || null,
      formatDate(trade.tradeDate),
      formatDate(trade.settlementDate),
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

    return new Promise((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) {
          console.error("Error inserting trade:", err.message);
          reject(new Error("Failed to insert trade"));
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Error in insertTrade:", error.message);
    throw error;
  }
};

/**
 * Patch a trade by ID (partial update).
 */
export const patchTrade = (tradeId, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) {
    return Promise.reject(new Error("No fields to update"));
  }

  const query = `
    UPDATE trades
    SET ${fields.map((field) => `${field} = ?`).join(", ")}
    WHERE tradeId = ?;
  `;

  return new Promise((resolve, reject) => {
    db.run(query, [...values, tradeId], function (err) {
      if (err) {
        console.error(`Error patching trade ${tradeId}:`, err.message);
        reject(new Error("Failed to patch trade"));
      } else if (this.changes === 0) {
        reject(new Error("No trade found to patch"));
      } else {
        resolve();
      }
    });
  });
};

/**
 * Update a trade by ID.
 */
export const updateTrade = (tradeId, updates) => {
  const query = `
    UPDATE trades
    SET tradeType = ?, parentTradeId = ?, tradeDate = ?, settlementDate = ?,
        weBuyWeSell = ?, counterpartyId = ?, buyCurrency = ?, sellCurrency = ?,
        buyAmount = ?, sellAmount = ?, exchangeRate = ?, buyNostroAccountId = ?, sellNostroAccountId = ?
    WHERE tradeId = ?;
  `;
  const params = [
    updates.tradeType,
    updates.parentTradeId || null,
    formatDate(updates.tradeDate),
    formatDate(updates.settlementDate),
    updates.weBuyWeSell,
    updates.counterpartyId,
    updates.buyCurrency,
    updates.sellCurrency,
    updates.buyAmount,
    updates.sellAmount,
    updates.exchangeRate,
    updates.buyNostroAccountId,
    updates.sellNostroAccountId,
    tradeId,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        console.error(`Error updating trade ${tradeId}:`, err.message);
        reject(new Error("Failed to update trade"));
      } else {
        resolve();
      }
    });
  });
};

/**
 * Delete a trade by ID.
 */
export const deleteTradeById = (tradeId) => {
  const query = "DELETE FROM trades WHERE tradeId = ?";
  return new Promise((resolve, reject) => {
    db.run(query, [tradeId], function (err) {
      if (err) {
        console.error(`❌ Error deleting trade ${tradeId}:`, err.message);
        reject(new Error("Failed to delete trade"));
      } else if (this.changes === 0) {
        reject(new Error(`No trade found with ID '${tradeId}'`)); // Add this check
      } else {
        console.log(`✅ Trade with ID '${tradeId}' deleted.`);
        resolve(this.changes);
      }
    });
  });
};
