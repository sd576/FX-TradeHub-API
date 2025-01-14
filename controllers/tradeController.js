import db from "../database/db.js";

/**
 * Helper function to parse JSON fields in the trade rows.
 */
const parseTradeRows = (rows) =>
  rows.map((row) => ({
    ...row,
    buyNostroAccount: row.buyNostroAccount
      ? JSON.parse(row.buyNostroAccount)
      : null,
    sellNostroAccount: row.sellNostroAccount
      ? JSON.parse(row.sellNostroAccount)
      : null,
  }));

/**
 * Fetch all trades, optionally filtered by 'we buy' or 'we sell'.
 */
export const fetchAllTrades = (req, res) => {
  const { weBuyWeSell, page = 1, size = 20 } = req.query;
  let query = "SELECT * FROM trades";
  const params = [];

  if (weBuyWeSell) {
    query += " WHERE weBuyWeSell = ?";
    params.push(weBuyWeSell);
  }

  // Pagination
  const offset = (page - 1) * size;
  query += " LIMIT ? OFFSET ?";
  params.push(size, offset);

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
    } else {
      res.json(parseTradeRows(rows));
    }
  });
};

/**
 * Fetch a single trade by ID.
 */
export const fetchTradeById = (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM trades WHERE tradeId = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trade" });
    } else if (!row) {
      res.status(404).json({ error: "Trade not found" });
    } else {
      res.json({
        ...row,
        buyNostroAccount: row.buyNostroAccount
          ? JSON.parse(row.buyNostroAccount)
          : null,
        sellNostroAccount: row.sellNostroAccount
          ? JSON.parse(row.sellNostroAccount)
          : null,
      });
    }
  });
};
