import express from "express";
import db from "../database/db.js";

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /api/nostroInstructions:
 *     get:
 *       summary: "Retrieve all nostro instructions or filter by counterpartyId and currency"
 *       tags:
 *         - Nostro Instructions
 *       parameters:
 *         - in: query
 *           name: counterpartyId
 *           schema:
 *             type: string
 *           description: "Filter nostro instructions by counterparty ID."
 *         - in: query
 *           name: currency
 *           schema:
 *             type: string
 *           description: "Filter nostro instructions by currency."
 *       responses:
 *         200:
 *           description: "A list of nostro instructions."
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NostroInstruction'
 *         500:
 *           description: "Internal server error."
 */
router.get("/", (req, res) => {
  const { counterpartyId, currency } = req.query;
  let query = "SELECT * FROM nostroInstructions";
  const params = [];

  if (counterpartyId || currency) {
    query += " WHERE";
    if (counterpartyId) {
      query += " counterpartyId = ?";
      params.push(counterpartyId);
    }
    if (currency) {
      if (counterpartyId) query += " AND";
      query += " currency = ?";
      params.push(currency);
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch nostro instructions" });
    } else {
      res.json(rows);
    }
  });
});

/**
 * @swagger
 * paths:
 *   /api/nostroInstructions:
 *     get:
 *       summary: "Retrieve all nostro instructions or filter by counterpartyId and currency"
 *       tags:
 *         - Nostro Instructions
 *       parameters:
 *         - in: query
 *           name: counterpartyId
 *           schema:
 *             type: string
 *           description: "Filter nostro instructions by counterparty ID."
 *         - in: query
 *           name: currency
 *           schema:
 *             type: string
 *           description: "Filter nostro instructions by currency."
 *       responses:
 *         200:
 *           description: "A single nostro instruction."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/NostroInstruction'
 *         404:
 *           description: "Nostro instruction not found."
 *         500:
 *           description: "Internal server error."
 */

router.get("/:counterpartyId/:currency", (req, res) => {
  const { counterpartyId, currency } = req.params;

  db.get(
    "SELECT * FROM nostroInstructions WHERE counterpartyId = ? AND currency = ?",
    [counterpartyId, currency],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: "Failed to fetch nostro instruction" });
      } else if (!row) {
        res.status(404).json({ error: "Nostro instruction not found" });
      } else {
        res.json(row);
      }
    }
  );
});

export default router;
