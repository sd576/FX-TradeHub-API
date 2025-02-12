import {
  getAllTrades,
  getTradesByCounterparty,
  getTradesByDateRange,
  getTradeById,
  getTradesByCriteria,
  insertTrade,
  updateTrade,
  patchTrade,
  deleteTradeById,
} from "../services/tradeService.js";
import { validationResult } from "express-validator";

// Fetch all trades
export const getAllTradesController = async (req, res) => {
  try {
    const trades = await getAllTrades();
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch trades by counterparty ID
export const getTradesByCounterpartyController = async (req, res) => {
  const { counterpartyId } = req.params;
  try {
    const trades = await getTradesByCounterparty(counterpartyId);
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch trades by date range
export const getTradesByDateRangeController = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const trades = await getTradesByDateRange(startDate, endDate);
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch a single trade by ID
export const getTradeByIdController = async (req, res) => {
  const { tradeId } = req.params;
  try {
    const trade = await getTradeById(tradeId);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }
    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch trades by custom criteria
export const getTradesByCriteriaController = async (req, res) => {
  try {
    const trades = await getTradesByCriteria(req.body);
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new trade
export const createTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await insertTrade(req.body);
    res.status(201).json({ message: "Trade created successfully" });
  } catch (error) {
    console.error("Failed to create trade:", error.message); // Log the error
    res.status(400).json({ error: error.message }); // Return the specific error message to the client
  }
};

// Update an existing trade
export const modifyTrade = async (req, res) => {
  const { tradeId } = req.params;
  try {
    // Check if trade exist before updating
    const existingTrade = await getTradeById(tradeId);

    if (!existingTrade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    // Update the trade
    await updateTrade(tradeId, req.body);

    // Fetch the updated trade
    const updatedTrade = await getTradeById(tradeId);
    res.status(200).json(updatedTrade);
  } catch (error) {
    res.status(400).json({
      error: error.message || `Failed to update trade with ID ${tradeId}`,
    });
  }
};

// Partially update a trade
export const patchTradeController = async (req, res) => {
  const { tradeId } = req.params;

  try {
    if (!Object.keys(req.body).length) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Check if trade exists before updating
    const existingTrade = await getTradeById(tradeId);
    if (!existingTrade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    const updatedTrade = await patchTrade(tradeId, req.body);
    res.status(200).json(updatedTrade); // Return the updated trade
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a trade by ID
export const deleteTradeByIdHandler = async (req, res) => {
  const { tradeId } = req.params;

  try {
    const existingTrade = await getTradeById(tradeId);
    if (!existingTrade) {
      return res
        .status(404)
        .json({ error: `Trade with ID '${tradeId}' not found.` });
    }

    await deleteTradeById(tradeId);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting trade ${tradeId}:`, error.message);
    res.status(500).json({ error: error.message });
  }
};
