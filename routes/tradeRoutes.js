import { Router } from "express";
import { validationResult } from "express-validator";
import {
  getAllTradesController,
  getTradesByCounterpartyController,
  getTradesByDateRangeController,
  getTradeByIdController,
  getTradesByCriteriaController,
  createTrade,
  modifyTrade,
  patchTradeController, // Correct name
  deleteTradeByIdHandler,
} from "../controllers/tradeController.js";
import { validateTrade } from "../validators/tradeValidator.js";

const router = Router();

// Retrieve all trades
router.get("/", getAllTradesController);

// Retrieve trades by counterparty ID
router.get("/counterparty/:counterpartyId", getTradesByCounterpartyController);

// Retrieve trades by date range
router.get("/date-range", getTradesByDateRangeController);

// Retrieve a single trade by ID
router.get("/:tradeId", getTradeByIdController);

// Retrieve trades by custom criteria
router.post(
  "/criteria",
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  getTradesByCriteriaController
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

// Update an existing trade
router.put(
  "/:tradeId",
  validateTrade,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  modifyTrade
);

// Partially update a trade
router.patch(
  "/:tradeId",
  (req, res, next) => {
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ error: "No fields to update" });
    }
    next();
  },
  patchTradeController // Correct controller
);

// Delete a trade by ID
router.delete("/:tradeId", deleteTradeByIdHandler);

export default router;
