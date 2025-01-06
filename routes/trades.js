import express from "express";
import { body, validationResult } from "express-validator";
import db from "../database/db.js"; // Use the centralized db connection

const router = express.Router();

/**
 * @swagger
 * /api/trades:
 *   get:
 *     summary: Retrieve all trades, optionally filtered by query parameters
 *     tags: [Trades]
 *     parameters:
 *       - in: query
 *         name: weBuyWeSell
 *         schema:
 *           type: string
 *         description: Filter trades by 'we buy' or 'we sell'
 *     responses:
 *       200:
 *         description: A list of all trades or filtered trades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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
 *               type: object
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
      row.buyNostroAccount = JSON.parse(row.buyNostroAccount);
      row.sellNostroAccount = JSON.parse(row.sellNostroAccount);
      res.json(row);
    }
  });
});

// Top Queries Section

/**
 * @swagger
 * /api/trades/sell:
 *   get:
 *     summary: Retrieve trades where weBuyWeSell = "we sell"
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: Trades where 'we sell'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 */
router.get("/sell", (req, res) => {
  const query = "SELECT * FROM trades WHERE weBuyWeSell = 'we sell'";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
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
 * /api/trades/buy:
 *   get:
 *     summary: Retrieve trades where weBuyWeSell = "we buy"
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: Trades where 'we buy'
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 */
router.get("/buy", (req, res) => {
  const query = "SELECT * FROM trades WHERE weBuyWeSell = 'we buy'";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
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
 *         description: The currency being bought
 *     responses:
 *       200:
 *         description: Trades filtered by buy currency
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 */
router.get("/byCurrency/:buyCurrency", (req, res) => {
  const { buyCurrency } = req.params;
  const query = "SELECT * FROM trades WHERE buyCurrency = ?";
  db.all(query, [buyCurrency], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
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

export default router;
