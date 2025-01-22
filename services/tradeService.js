import db from "../database/db.js";

/**
 * Fetch all trades.
 * @returns {Promise<Array>} - A promise resolving to an array of trade records.
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
 * @param {string} counterpartyId - The ID of the counterparty.
 * @returns {Promise<Array>} - A promise resolving to an array of trade records.
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
 * @param {string} startDate - The start date of the range.
 * @param {string} endDate - The end date of the range.
 * @returns {Promise<Array>} - A promise resolving to an array of trade records.
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
 * @param {string} tradeId - The ID of the trade.
 * @returns {Promise<Object|null>} - A promise resolving to the trade record or null.
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
 * @param {Object} criteria - Filter criteria for querying trades.
 * @returns {Promise<Array>} - A promise resolving to an array of matching trade records.
 */
export const getTradesByCriteria = (criteria) => {
  const { buyCurrency, sellCurrency, exchangeRate } = criteria;

  let query = "SELECT * FROM trades WHERE 1=1"; // Base query
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
 * @param {Object} trade - The trade details.
 * @returns {Promise<void>} - A promise resolving when the operation is complete.
 */
export const insertTrade = (trade) => {
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
};

/**
 * Patch a trade by ID (partial update).
 * @param {string} tradeId - The ID of the trade.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<void>} - A promise resolving when the update is complete.
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
    db.run(query, [...values, tradeId], (err) => {
      if (err) {
        console.error(`Error patching trade ${tradeId}:`, err.message);
        reject(new Error("Failed to patch trade"));
      } else {
        resolve();
      }
    });
  });
};

/**
 * Update a trade by ID.
 * @param {string} tradeId - The ID of the trade.
 * @param {Object} updates - The updated trade details.
 * @returns {Promise<void>} - A promise resolving when the update is complete.
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
    updates.tradeDate,
    updates.settlementDate,
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
 * @param {string} tradeId - The ID of the trade.
 * @returns {Promise<void>} - A promise resolving when the trade is deleted.
 */
export const deleteTradeById = (tradeId) => {
  const query = "DELETE FROM trades WHERE tradeId = ?";
  return new Promise((resolve, reject) => {
    db.run(query, [tradeId], (err) => {
      if (err) {
        console.error(`Error deleting trade ${tradeId}:`, err.message);
        reject(new Error("Failed to delete trade"));
      } else {
        resolve();
      }
    });
  });
};
