import express from "express";
import { body, validationResult } from "express-validator";
import db from "../database/db.js"; // Use the centralized db connection

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
router.get("/", (req, res) => {
  db.all("SELECT * FROM counterparties", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch counterparties" });
    } else {
      // Parse the nostroAccounts field from JSON to an object
      const parsedRows = rows.map((row) => ({
        ...row,
        nostroAccounts: (() => {
          try {
            return JSON.parse(row.nostroAccounts);
          } catch {
            return {};
          }
        })(),
      }));
      res.json(parsedRows);
    }
  });
});

/**
 * @swagger
 * /api/counterparties/{id}:
 *   get:
 *     summary: Retrieve a specific counterparty by ID
 *     tags: [Counterparties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the counterparty
 *     responses:
 *       200:
 *         description: Details of the specified counterparty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the counterparty
 *                 name:
 *                   type: string
 *                   description: Name of the counterparty
 *                 city:
 *                   type: string
 *                   description: City where the counterparty is located
 *                 country:
 *                   type: string
 *                   description: Country where the counterparty is located
 *                 currency:
 *                   type: string
 *                   description: Default currency used by the counterparty
 *       404:
 *         description: Counterparty not found
 *       500:
 *         description: Server error
 */

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM counterparties WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch counterparty" });
    } else if (!row) {
      res.status(404).json({ error: "Counterparty not found" });
    } else {
      // Parse the nostroAccounts field from JSON to an object
      row.nostroAccounts = JSON.parse(row.nostroAccounts);
      res.json(row);
    }
  });
});

/**
 * @swagger
 * /api/counterparties:
 *   post:
 *     summary: Add a new counterparty
 *     tags: [Counterparties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               currency:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               nostroAccount:
 *                 type: string
 *               swiftCode:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Counterparty added successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  [
    body("id").isInt().withMessage("ID must be an integer"),
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
      country,
      currency,
      accountNumber,
      nostroAccount,
      swiftCode,
      contactPerson,
      email,
      phone,
    } = req.body;

    const query = `
      INSERT INTO counterparties (id, name, country, currency, accountNumber, nostroAccount, swiftCode, contactPerson, email, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      name,
      country,
      currency,
      accountNumber,
      nostroAccount,
      swiftCode,
      contactPerson,
      email,
      phone,
    ];

    db.run(query, params, (err) => {
      if (err) {
        res.status(500).json({ error: "Failed to add counterparty" });
      } else {
        res.status(201).json({ message: "Counterparty added successfully!" });
      }
    });
  }
);

export default router;
