import express from "express";
import db from "../database/db.js";

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /api/nostroAccounts:
 *     get:
 *       summary: "Retrieve all nostro accounts or filter by counterpartyId and currency"
 *       tags:
 *         - Nostro Accounts
 *       parameters:
 *         - in: query
 *           name: counterpartyId
 *           schema:
 *             type: string
 *           description: "Filter nostro accounts by counterparty ID."
 *         - in: query
 *           name: currency
 *           schema:
 *             type: string
 *           description: "Filter nostro accounts by currency."
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

router.get("/", (req, res) => {
  const { counterpartyId, currency } = req.query;
  let query = "SELECT * FROM nostroAccounts";
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
      res.status(500).json({ error: "Failed to fetch nostro accounts" });
    } else {
      res.json(rows);
    }
  });
});

/**
 * @swagger
 * paths:
 *   /api/nostroAccounts/{id}:
 *     get:
 *       summary: "Retrieve a nostro account by ID"
 *       tags:
 *         - Nostro Accounts
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: "The nostro account ID"
 *       responses:
 *         200:
 *           description: "A single nostro account."
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/NostroAccount'
 *         404:
 *           description: "Nostro account not found."
 *         500:
 *           description: "Internal server error."
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM nostroAccounts WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch nostro account" });
    } else if (!row) {
      res.status(404).json({ error: "Nostro account not found" });
    } else {
      res.json(row);
    }
  });
});

export default router;
