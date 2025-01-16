import express from "express";
import {
  fetchAllTrades,
  fetchTradeById,
  fetchTradesByDateRange,
  createTrade,
  deleteTradeById,
} from "../controllers/tradeController.js";

const router = express.Router();
router.get("/", fetchAllTrades);
router.get("/:tradeId", fetchTradeById);
router.get("/date-range", fetchTradesByDateRange);
router.post("/", createTrade);
router.delete("/:tradeId", deleteTradeById);

export default router;
