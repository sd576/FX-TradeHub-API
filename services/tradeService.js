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
