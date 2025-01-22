import { Router } from "express";
import { validationResult } from "express-validator";
import {
  getAllSettlementsController,
  getSettlementsByCounterpartyController,
  getSettlementByCounterpartyAndCurrencyController,
  updateSettlement,
  patchSettlement,
  removeSettlement,
} from "../controllers/settlementController.js";
import { validateSettlementParams } from "../validators/settlementValidator.js";

const router = Router();

// Helper middleware for validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Retrieve all settlements
router.get("/", getAllSettlementsController);

// Retrieve settlements by counterparty ID
router.get("/:counterpartyId", getSettlementsByCounterpartyController);

// Retrieve settlement by counterparty ID and currency
router.get(
  "/:counterpartyId/:currency",
  validateSettlementParams,
  handleValidation,
  getSettlementByCounterpartyAndCurrencyController
);

// Update or replace a settlement
router.put(
  "/:counterpartyId/:currency",
  validateSettlementParams,
  handleValidation,
  updateSettlement
);

// Partially update a settlement
router.patch("/:id", patchSettlement);

// Delete a settlement
router.delete(
  "/:counterpartyId/:currency",
  validateSettlementParams,
  handleValidation,
  removeSettlement
);

export default router;
