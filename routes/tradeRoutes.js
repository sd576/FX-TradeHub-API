import express from "express";
import db from "../database/db.js";

const router = express.Router();

/**
 * Parse JSON fields in the trade rows.
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
 * @swagger
 * paths:
 *   /api/trades:
 *     get:
 *       summary: "Retrieve all trades, optionally filtered by 'we buy' or 'we sell'"
 *       tags:
 *         - Trades
 *       parameters:
 *         - in: query
 *           name: weBuyWeSell
 *           schema:
 *             type: string
 *             enum: [we buy, we sell]
 *           description: "Filter trades by 'we buy' or 'we sell'."
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: "The page number to retrieve."
 *         - in: query
 *           name: size
 *           schema:
 *             type: integer
 *             default: 20
 *           description: "The number of items per page."
 *       responses:
 *         200:
 *           description: "A paginated list of trades."
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Trade'
 *         400:
 *           description: "Invalid query parameters."
 *         500:
 *           description: "Internal server error."
 */
router.get("/", (req, res) => {
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
});

/**
 * @swagger
 * paths:
 *   /api/trades/{id}:
 *     get:
 *       summary: "Retrieve a trade by ID"
 *       tags:
 *         - Trades
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: "The trade ID"
 *       responses:
 *         200:
 *           description: "A single trade."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Trade'
 *         404:
 *           description: "Trade not found."
 */
router.get("/:id", (req, res) => {
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
});

export default router;
