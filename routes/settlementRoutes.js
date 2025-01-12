import express from "express";
import db from "../database/db.js"; // SQLite connection

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Settlements
 *   description: Account settlement details
 */

/**
 * @swagger
 * paths:
 *   /api/settlements:
 *     get:
 *       summary: Retrieve all settlements
 *       tags:
 *         - Settlements
 *       responses:
 *         200:
 *           description: A list of all settlements
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Settlement'
 *         500:
 *           description: Internal server error
 */

// Get all settlements
router.get("/", (req, res) => {
  const query = `
    SELECT * FROM settlements_view;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch settlements" });
    } else {
      res.json(rows);
    }
  });
});

/**
 * @swagger
 * paths:
 *   /api/settlements/{counterpartyId}:
 *     get:
 *       summary: Retrieve settlements for a specific counterparty
 *       tags:
 *         - Settlements
 *       parameters:
 *         - in: path
 *           name: counterpartyId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the counterparty
 *       responses:
 *         200:
 *           description: Settlements for the counterparty
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Settlement'
 *         404:
 *           description: No settlements found
 *         500:
 *           description: Internal server error
 */
// Get settlements for a specific counterparty
router.get("/:counterpartyId", (req, res) => {
  const { counterpartyId } = req.params;

  const query = `
    SELECT
      ni.currency AS "Currency",
      ni.nostroAccountId AS "Nostro Account ID",
      na.description AS "Nostro Account Description",
      c.id AS "Counterparty ID",
      c.name AS "Counterparty Name",
      c.city AS "City",
      c.country AS "Country"
    FROM
      nostroInstructions ni
    JOIN
      nostroAccounts na
    ON
      ni.nostroAccountId = na.id
    JOIN
      counterparties c
    ON
      ni.counterpartyId = c.id
    WHERE
      c.id = ?;
  `;

  db.all(query, [counterpartyId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch settlements" });
    } else if (rows.length === 0) {
      res
        .status(404)
        .json({ error: "No settlements found for this counterparty" });
    } else {
      const result = {
        "Counterparty ID": rows[0]["Counterparty ID"],
        "Counterparty Name": rows[0]["Counterparty Name"],
        City: rows[0]["City"],
        Country: rows[0]["Country"],
        nostroAccounts: rows.map((row) => ({
          currency: row["Currency"],
          nostroAccountId: row["Nostro Account ID"],
          nostroAccountDescription: row["Nostro Account Description"],
        })),
      };
      res.json(result);
    }
  });
});

/**
 * @swagger
 * paths:
 *   /api/settlements/{counterpartyId}/{currency}:
 *     get:
 *       summary: Retrieve settlement details for a specific counterparty and currency
 *       tags:
 *         - Settlements
 *       parameters:
 *         - in: path
 *           name: counterpartyId
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the counterparty
 *         - in: path
 *           name: currency
 *           required: true
 *           schema:
 *             type: string
 *           description: The currency code (e.g., USD, EUR)
 *       responses:
 *         200:
 *           description: Settlement details for the counterparty and currency
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Settlement'
 *         404:
 *           description: No settlement found
 *         500:
 *           description: Internal server error
 */
// Get settlement details for a specific counterparty and currency
router.get("/:counterpartyId/:currency", (req, res) => {
  const { counterpartyId, currency } = req.params;

  const query = `
    SELECT
      ni.currency AS "Currency",
      ni.nostroAccountId AS "Nostro Account ID",
      na.description AS "Nostro Account Description",
      c.id AS "Counterparty ID",
      c.name AS "Counterparty Name",
      c.city AS "City",
      c.country AS "Country"
    FROM
      nostroInstructions ni
    JOIN
      nostroAccounts na
    ON
      ni.nostroAccountId = na.id
    JOIN
      counterparties c
    ON
      ni.counterpartyId = c.id
    WHERE
      c.id = ? AND ni.currency = ?;
  `;

  db.get(query, [counterpartyId, currency], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch settlement details" });
    } else if (!row) {
      res
        .status(404)
        .json({
          error: "No settlement found for this counterparty and currency",
        });
    } else {
      res.json(row);
    }
  });
});

export default router;
