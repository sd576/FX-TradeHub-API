import express from "express";
import {
  fetchAllTrades,
  fetchTradeById,
} from "../controllers/tradeController.js";

const router = express.Router();

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
router.get("/", fetchAllTrades);

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
router.get("/:id", fetchTradeById);

export default router;
