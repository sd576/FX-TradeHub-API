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
      res.json(row); // Directly return the row as no parsing is needed
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
          return res
            .status(409)
            .json({ error: "Counterparty with this ID already exists." });
        }
        return res.status(500).json({ error: "Failed to add counterparty" });
      } else {
        res.status(201).json({ message: "Counterparty added successfully!" });
      }
    });
  }
);

export default router;
