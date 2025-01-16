import { Router } from "express";
import { validationResult } from "express-validator";
import {
  fetchAllSettlements,
  fetchSettlementsByCounterparty,
  fetchSettlementByCounterpartyAndCurrency,
  updateSettlement,
  removeSettlement,
} from "../controllers/settlementController.js";

import { validateSettlementParams } from "../validators/settlementValidator.js";

const router = Router();

// Retrieve all settlements
router.get("/", fetchAllSettlements);

// Retrieve settlements by counterparty ID
router.get("/:counterpartyId", fetchSettlementsByCounterparty);

// Retrieve settlement by counterparty ID and currency
router.get(
  "/:counterpartyId/:currency",
  validateSettlementParams,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  fetchSettlementByCounterpartyAndCurrency
);

// Update or replace a settlement
router.put(
  "/:counterpartyId/:currency",
  validateSettlementParams,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  updateSettlement
);

// Delete a settlement
router.delete(
  "/:counterpartyId/:currency",
  validateSettlementParams,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  removeSettlement
);

export default router;
