import { Router } from "express";
import {
  fetchCounterparties,
  fetchCounterpartyById,
  createCounterparty,
} from "../controllers/counterpartyController.js";
import { body, validationResult } from "express-validator";

const router = Router();

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
router.get("/", fetchCounterparties);

/**
 * @swagger
 * /api/counterparties/{counterpartyId}:
 *   get:
 *     summary: Retrieve a single counterparty by ID
 *     tags: [Counterparties]
 *     parameters:
 *       - in: path
 *         name: counterpartyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the counterparty
 *     responses:
 *       200:
 *         description: A single counterparty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 city:
 *                   type: string
 *                 country:
 *                   type: string
 *                 currency:
 *                   type: string
 *                 accountNumber:
 *                   type: string
 *                 swiftCode:
 *                   type: string
 *                 contactPerson:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       404:
 *         description: Counterparty not found
 *       500:
 *         description: Internal server error
 */
router.get("/:counterpartyId", fetchCounterpartyById);

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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createCounterparty
);

export default router;
