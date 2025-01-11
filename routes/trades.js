import express from "express";
import db from "../database/db.js";

const router = express.Router();

/**
 * Parse JSON fields in the trade rows.
 */
const parseTradeRows = (rows) =>
  rows.map((row) => ({
    ...row,
    buyNostroAccount: JSON.parse(row.buyNostroAccount),
    sellNostroAccount: JSON.parse(row.sellNostroAccount),
  }));

/**
 * @swagger
 * /api/trades:
 *   get:
 *     summary: Retrieve all trades, optionally filtered by 'we buy' or 'we sell'
 *     tags: [Trades]
 *     parameters:
 *       - in: query
 *         name: weBuyWeSell
 *         required: false
 *         schema:
 *           type: string
 *           enum: [we buy, we sell]
 *         description: Filter trades by 'we buy' or 'we sell'
 *     responses:
 *       200:
 *         description: A list of all trades or filtered trades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 */
router.get("/", (req, res) => {
  const { weBuyWeSell } = req.query;
  let query = "SELECT * FROM trades";
  const params = [];

  if (weBuyWeSell) {
    query += " WHERE weBuyWeSell = ?";
    params.push(weBuyWeSell);
  }

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
 * /api/trades/{id}:
 *   get:
 *     summary: Retrieve a trade by ID
 *     tags: [Trades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trade ID
 *     responses:
 *       200:
 *         description: A single trade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trade'
 *       404:
 *         description: Trade not found
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
        buyNostroAccount: JSON.parse(row.buyNostroAccount),
        sellNostroAccount: JSON.parse(row.sellNostroAccount),
      });
    }
  });
});

/**
 * @swagger
 * /api/trades/byCurrency/{buyCurrency}:
 *   get:
 *     summary: Retrieve trades filtered by buy currency
 *     tags: [Trades]
 *     parameters:
 *       - in: path
 *         name: buyCurrency
 *         required: true
 *         schema:
 *           type: string
 *           enum: [USD, GBP, EUR, JPY, AUD, NZD, CAD] # Add available currencies
 *         description: The currency being bought (case-insensitive, automatically converted to uppercase)
 *     responses:
 *       200:
 *         description: Trades filtered by buy currency
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 *       404:
 *         description: No trades found for the given currency
 *       400:
 *         description: Invalid currency parameter
 */
router.get("/byCurrency/:buyCurrency", (req, res) => {
  const { buyCurrency } = req.params;

  if (!buyCurrency) {
    return res.status(400).json({ error: "Currency is required" });
  }

  const upperCurrency = buyCurrency.toUpperCase(); // Convert to uppercase
  const query = "SELECT * FROM trades WHERE buyCurrency = ?";

  db.all(query, [upperCurrency], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
    } else if (rows.length === 0) {
      res
        .status(404)
        .json({ error: `No trades found for buyCurrency: ${upperCurrency}` });
    } else {
      const parsedRows = rows.map((row) => ({
        ...row,
        buyNostroAccount: JSON.parse(row.buyNostroAccount),
        sellNostroAccount: JSON.parse(row.sellNostroAccount),
      }));
      res.json(parsedRows);
    }
  });
});

/**
 * @swagger
 * /api/trades/byCurrency/{sellCurrency}:
 *   get:
 *     summary: Retrieve trades filtered by sell currency
 *     tags: [Trades]
 *     parameters:
 *       - in: path
 *         name: sellCurrency
 *         required: true
 *         schema:
 *           type: string
 *           enum: [USD, GBP, EUR, JPY, AUD, NZD, CAD] # Add available currencies
 *         description: The currency being sold (case-insensitive, automatically converted to uppercase)
 *     responses:
 *       200:
 *         description: Trades filtered by sell currency
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 *       404:
 *         description: No trades found for the given currency
 *       400:
 *         description: Invalid currency parameter
 */
router.get("/byCurrency/:sellCurrency", (req, res) => {
  const { sellCurrency } = req.params;

  if (!sellCurrency) {
    return res.status(400).json({ error: "Currency is required" });
  }

  const upperCurrency = sellCurrency.toUpperCase(); // Convert to uppercase
  const query = "SELECT * FROM trades WHERE sellCurrency = ?";

  db.all(query, [upperCurrency], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
    } else if (rows.length === 0) {
      res
        .status(404)
        .json({ error: `No trades found for sellCurrency: ${upperCurrency}` });
    } else {
      const parsedRows = rows.map((row) => ({
        ...row,
        buyNostroAccount: JSON.parse(row.buyNostroAccount),
        sellNostroAccount: JSON.parse(row.sellNostroAccount),
      }));
      res.json(parsedRows);
    }
  });
});

/**
 * Unified route for "we buy" and "we sell" queries
 * @swagger
 * /api/trades/filter:
 *   get:
 *     summary: Retrieve trades filtered by 'we buy' or 'we sell'
 *     tags: [Trades]
 *     parameters:
 *       - in: query
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [we buy, we sell]
 *         description: Filter trades by 'we buy' or 'we sell'
 *     responses:
 *       200:
 *         description: Trades filtered by 'we buy' or 'we sell'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 */
router.get("/filter", (req, res) => {
  const { filter } = req.query;

  if (!filter || !["we buy", "we sell"].includes(filter)) {
    return res.status(400).json({ error: "Invalid filter parameter" });
  }

  const query = "SELECT * FROM trades WHERE weBuyWeSell = ?";
  db.all(query, [filter], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
    } else {
      res.json(parseTradeRows(rows));
    }
  });
});

export default router;
