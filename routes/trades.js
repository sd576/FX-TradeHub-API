import express from "express";
import { body, validationResult } from "express-validator";
import db from "../database/db.js"; // Use the centralized db connection

const router = express.Router();

/**
 * @swagger
 * /api/trades:
 *   get:
 *     summary: Retrieve all trades
 *     tags: [Trades]
 *     responses:
 *       200:
 *         description: A list of all trades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tradeId:
 *                     type: string
 *                     description: Unique identifier for the trade
 *                   tradeType:
 *                     type: string
 *                     description: Type of trade (e.g., SPOT, FWD, SWAP)
 *                   counterpartyId:
 *                     type: string
 *                     description: Identifier for the trade's counterparty
 *                   tradeDate:
 *                     type: string
 *                     format: date
 *                     description: Date of the trade
 *                   buyCurrency:
 *                     type: string
 *                     description: The currency being bought
 *                   sellCurrency:
 *                     type: string
 *                     description: The currency being sold
 *                   buyAmount:
 *                     type: number
 *                     format: float
 *                     description: Amount of currency being bought
 *                   sellAmount:
 *                     type: number
 *                     format: float
 *                     description: Amount of currency being sold
 *                   exchangeRate:
 *                     type: number
 *                     format: float
 *                     description: Exchange rate for the trade
 */

router.get("/", (req, res) => {
  db.all("SELECT * FROM trades", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch trades" });
    } else {
      // Parse the nostroAccounts field from JSON to an object
      const parsedRows = rows.map((row) => ({
        ...row,
        buyNostroAccount: JSON.parse(row.buyNostroAccount),
        sellNostroAccount: JSON.parse(row.sellNostroAccount),
      }));
      // Use parsedRows instead of rows in the response
      res.json(parsedRows);
    }
  });
});

// Fetch a specific trade by ID
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
      res.json(row);
    }
  });
});

// Add a new trade
/**
 * @swagger
 * /api/trades:
 *   post:
 *     summary: Add a new trade
 *     tags: [Trades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeId:
 *                 type: string
 *               counterpartyId:
 *                 type: string
 *               tradeDate:
 *                 type: string
 *               buyCurrency:
 *                 type: string
 *               sellCurrency:
 *                 type: string
 *               buyAmount:
 *                 type: number
 *               sellAmount:
 *                 type: number
 *               exchangeRate:
 *                 type: number
 *               settlementDate:
 *                 type: string
 *               nearDate:
 *                 type: string
 *               farDate:
 *                 type: string
 *               tradeType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Trade added successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  [
    body("tradeId").isString().withMessage("Trade ID must be a string"),
    body("counterpartyId")
      .isString()
      .withMessage("Counterparty ID must be a string"),
    body("tradeDate")
      .isISO8601()
      .withMessage("Trade date must be in ISO 8601 format"),
    body("buyCurrency").isString().withMessage("Buy currency must be a string"),
    body("sellCurrency")
      .isString()
      .withMessage("Sell currency must be a string"),
    body("buyAmount")
      .isFloat({ min: 0 })
      .withMessage("Buy amount must be a positive number"),
    body("sellAmount")
      .isFloat({ min: 0 })
      .withMessage("Sell amount must be a positive number"),
    body("exchangeRate")
      .isFloat({ min: 0 })
      .withMessage("Exchange rate must be a positive number"),
    body("settlementDate")
      .isISO8601()
      .withMessage("Settlement date must be in ISO 8601 format"),
    body("tradeType").isString().withMessage("Trade type must be a string"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      tradeId,
      counterpartyId,
      tradeDate,
      buyCurrency,
      sellCurrency,
      buyAmount,
      sellAmount,
      exchangeRate,
      settlementDate,
      nearDate,
      farDate,
      tradeType,
    } = req.body;

    const query = `
      INSERT INTO trades (
        tradeId, counterpartyId, tradeDate, buyCurrency, sellCurrency, 
        buyAmount, sellAmount, exchangeRate, settlementDate, nearDate, farDate, tradeType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      tradeId,
      counterpartyId,
      tradeDate,
      buyCurrency,
      sellCurrency,
      buyAmount,
      sellAmount,
      exchangeRate,
      settlementDate,
      nearDate,
      farDate,
      tradeType,
    ];

    db.run(query, params, (err) => {
      if (err) {
        res.status(500).json({ error: "Failed to add trade" });
      } else {
        res.status(201).json({ message: "Trade added successfully!" });
      }
    });
  }
);

export default router;
