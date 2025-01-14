import express from "express";
import {
  fetchAllSettlements,
  fetchSettlementByCounterparty,
  fetchSettlementByCounterpartyAndCurrency,
  updateSettlement,
  partialUpdateSettlement,
  deleteSettlement,
} from "../controllers/settlementController.js";

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
router.get("/", fetchAllSettlements);

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
router.get("/:counterpartyId", fetchSettlementByCounterparty);

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
router.get(
  "/:counterpartyId/:currency",
  fetchSettlementByCounterpartyAndCurrency
);

/**
 * @swagger
 * paths:
 *   /api/settlements/{counterpartyId}/{currency}:
 *     put:
 *       summary: Replace settlement details for a specific counterparty and currency
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
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nostroAccountId:
 *                   type: string
 *                   description: The new nostro account ID
 *                   example: "001EUR"
 *                 nostroAccountDescription:
 *                   type: string
 *                   description: The description of the nostro account
 *                   example: "Barclays Bank - EUR"
 *       responses:
 *         200:
 *           description: Settlement replaced successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         400:
 *           description: Validation error
 *         404:
 *           description: Settlement not found
 *         500:
 *           description: Server error
 */
router.put("/:counterpartyId/:currency", updateSettlement);

/**
 * @swagger
 * paths:
 *   /api/settlements/{counterpartyId}/{currency}:
 *     patch:
 *       summary: Partially update settlement details for a specific counterparty and currency
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
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nostroAccountId:
 *                   type: string
 *                 nostroAccountDescription:
 *                   type: string
 *       responses:
 *         200:
 *           description: Settlement updated successfully
 *         404:
 *           description: Settlement not found
 *         500:
 *           description: Server error
 */
router.patch("/:counterpartyId/:currency", partialUpdateSettlement);

/**
 * @swagger
 * paths:
 *   /api/settlements/{counterpartyId}/{currency}:
 *     delete:
 *       summary: Delete settlement details for a specific counterparty and currency
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
 *           description: Settlement deleted successfully
 *         404:
 *           description: Settlement not found
 *         500:
 *           description: Server error
 */
router.delete("/:counterpartyId/:currency", deleteSettlement);

export default router;
