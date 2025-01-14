import db from "../database/db.js";

/**
 * Retrieve all trades, optionally filtered by 'we buy' or 'we sell' with pagination.
 * @param {string} [weBuyWeSell] - Optional filter for 'we buy' or 'we sell'.
 * @param {number} [page=1] - Page number for pagination.
 * @param {number} [size=20] - Number of records per page.
 * @returns {Promise<Array>} - A promise that resolves to a paginated array of trades.
 */
export const getAllTrades = (weBuyWeSell, page = 1, size = 20) => {
  let query = "SELECT * FROM trades";
  const params = [];

  if (weBuyWeSell) {
    query += " WHERE weBuyWeSell = ?";
    params.push(weBuyWeSell);
  }

  // Add pagination
  const offset = (page - 1) * size;
  query += " LIMIT ? OFFSET ?";
  params.push(size, offset);

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
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
 * Retrieve a single trade by its ID.
 * @param {string} tradeId - The ID of the trade to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the trade object, or null if not found.
 */
export const getTradeById = (tradeId) => {
  const query = "SELECT * FROM trades WHERE tradeId = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [tradeId], (err, row) => {
      if (err) {
        console.error(`Error fetching trade with ID ${tradeId}:`, err.message);
        reject(new Error("Failed to fetch trade"));
      } else {
        resolve(row || null);
      }
    });
  });
};

/**
 * Parse JSON fields (e.g., nostro account details) in trade rows.
 * @param {Array} rows - Rows of trades to parse.
 * @returns {Array} - Parsed rows with JSON fields converted to objects.
 */
export const parseTradeRows = (rows) =>
  rows.map((row) => ({
    ...row,
    buyNostroAccount: row.buyNostroAccount
      ? JSON.parse(row.buyNostroAccount)
      : null,
    sellNostroAccount: row.sellNostroAccount
      ? JSON.parse(row.sellNostroAccount)
      : null,
  }));
