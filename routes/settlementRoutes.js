import { Router } from "express";
import {
  fetchAllSettlements,
  fetchSettlementsByCounterparty,
  fetchSettlementByCounterpartyAndCurrency,
  updateSettlement,
  removeSettlement,
} from "../controllers/settlementController.js";

const router = Router();

// Routes
router.get("/", fetchAllSettlements);
router.get("/:counterpartyId", fetchSettlementsByCounterparty);
router.get(
  "/:counterpartyId/:currency",
  fetchSettlementByCounterpartyAndCurrency
);
router.put("/:counterpartyId/:currency", updateSettlement);
router.delete("/:counterpartyId/:currency", removeSettlement);

export default router;
