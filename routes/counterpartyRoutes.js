import express from "express";
import { body, validationResult } from "express-validator";
import db from "../database/db.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Counterparties
 *   description: API for managing counterparties
 */

/**
 * @swagger
 * /api/counterparties:
 *   get:
 *     summary: Retrieve all counterparties
 *     tags: [Counterparties]
 *     responses:
 *       200:
 *         description: A list of counterparties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

// Retrieve all counterparties
router.get("/", (req, res) => {
  db.all("SELECT * FROM counterparties", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch counterparties" });
    } else {
      res.json(rows); // Return all counterparties as-is
    }
  });
});

/**
 * @swagger
 * /api/settlements/{counterpartyId}:
 *   get:
 *     summary: Retrieve settlements for a specific counterparty
 *     tags:
 *       - Settlements
 *     parameters:
 *       - in: path
 *         name: counterpartyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the counterparty
 *     responses:
 *       200:
 *         description: Settlements for the counterparty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Counterparty ID:
 *                   type: string
 *                 Counterparty Name:
 *                   type: string
 *                 City:
 *                   type: string
 *                 Country:
 *                   type: string
 *                 nostroAccounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       currency:
 *                         type: string
 *                       nostroAccountId:
 *                         type: string
 *                       description:
 *                         type: string
 *       404:
 *         description: No settlements found
 *       500:
 *         description: Internal server error
 */
router.get("/:counterpartyId", (req, res) => {
  const { counterpartyId } = req.params;

  const query = `
    SELECT
      ni.currency AS "currency",
      ni.nostroAccountId AS "nostroAccountId",
      na.description AS "description",
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
      // Build structured response
      const result = {
        "Counterparty ID": rows[0]["Counterparty ID"],
        "Counterparty Name": rows[0]["Counterparty Name"],
        City: rows[0]["City"],
        Country: rows[0]["Country"],
        nostroAccounts: rows.map((row) => ({
          currency: row.currency,
          nostroAccountId: row.nostroAccountId,
          description: row.description,
        })),
      };
      res.json(result);
    }
  });
});

/**
 * @swagger
 * /api/counterparties:
 *   post:
 *     summary: Add a new counterparty
 *     tags: [Counterparties]
 *     description: |
 *       Add a new counterparty. Below is an example of the required fields with their expected types and length:
 *       - **id**: A unique identifier for the counterparty (string, max length: 20, e.g., "CPTY001").
 *       - **name**: Name of the counterparty (string, max length: 100, e.g., "Global Trading Ltd").
 *       - **city**: City of the counterparty (string, optional, max length: 50, e.g., "London").
 *       - **country**: Country of the counterparty (string, max length: 50, e.g., "UK").
 *       - **currency**: Default trading currency (string, 3 characters, e.g., "GBP").
 *       - **accountNumber**: Account number (string, max length: 20, e.g., "12345678").
 *       - **swiftCode**: SWIFT code (string, max length: 11, e.g., "GB123456").
 *       - **contactPerson**: Contact person (string, optional, max length: 50, e.g., "John Doe").
 *       - **email**: Email address (string, must be valid, e.g., "johndoe@example.com").
 *       - **phone**: Phone number (string, optional, max length: 15, e.g., "+441234567890").
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 maxLength: 20
 *                 example: "CPTY001"
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Global Trading Ltd"
 *               city:
 *                 type: string
 *                 maxLength: 50
 *                 example: "London"
 *               country:
 *                 type: string
 *                 maxLength: 50
 *                 example: "UK"
 *               currency:
 *                 type: string
 *                 maxLength: 3
 *                 example: "GBP"
 *               accountNumber:
 *                 type: string
 *                 maxLength: 20
 *                 example: "12345678"
 *               swiftCode:
 *                 type: string
 *                 maxLength: 11
 *                 example: "GB123456"
 *               contactPerson:
 *                 type: string
 *                 maxLength: 50
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               phone:
 *                 type: string
 *                 maxLength: 15
 *                 example: "+441234567890"
 *     responses:
 *       201:
 *         description: Counterparty added successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate record error
 */

// Add a new counterparty
router.post(
  "/",
  [
    body("id").isString().withMessage("ID must be a string"),
    body("name").isString().withMessage("Name must be a string"),
    body("country").isString().withMessage("Country must be a string"),
    body("currency").isString().withMessage("Currency must be a string"),
    body("email").isEmail().withMessage("Invalid email address"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      id,
      name,
      city,
      country,
      currency,
      accountNumber,
      swiftCode,
      contactPerson,
      email,
      phone,
    } = req.body;

    const query = `
      INSERT INTO counterparties (
        id, name, city, country, currency, accountNumber, swiftCode, contactPerson, email, phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      name,
      city,
      country,
      currency,
      accountNumber,
      swiftCode,
      contactPerson,
      email,
      phone,
    ];

    db.run(query, params, (err) => {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          res
            .status(409)
            .json({ error: "Counterparty with this ID already exists." });
        } else {
          res.status(500).json({ error: "Failed to add counterparty" });
        }
      } else {
        res.status(201).json({ message: "Counterparty added successfully!" });
      }
    });
  }
);

export default router;
