import express from "express";
import { validationResult } from "express-validator";
import {
  fetchAllTrades,
  fetchTradeById,
  fetchTradesByDateRange,
  createTrade,
  deleteTradeByIdHandler,
} from "../controllers/tradeController.js";
import {
  validateTradeId,
  validateTrade,
  validateDateRange,
} from "../validators/tradeValidator.js";

const router = express.Router();

// Retrieve all trades
router.get("/", fetchAllTrades);

// Retrieve a trade by ID
router.get(
  "/:tradeId",
  validateTradeId,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  fetchTradeById
);

// Retrieve trades by date range
router.get(
  "/date-range",
  validateDateRange,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  fetchTradesByDateRange
);

// Create a new trade
router.post(
  "/",
  validateTrade,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createTrade
);

// Delete a trade by ID
router.delete(
  "/:tradeId",
  validateTradeId, // Add validation for trade ID
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  deleteTradeByIdHandler // Updated to use the correct handler
);

export default router;
