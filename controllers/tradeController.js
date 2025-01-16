import {
  getAllTrades,
  getTradesByCounterparty,
  getTradesByDateRange,
  getTradeById,
  getTradesByCriteria,
  insertTrade,
  updateTrade,
  deleteTradeById,
} from "../services/tradeService.js";

export const fetchAllTrades = async (req, res) => {
  try {
    const trades = await getAllTrades();
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchTradesByCounterparty = async (req, res) => {
  const { counterpartyId } = req.params;
  try {
    const trades = await getTradesByCounterparty(counterpartyId);
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchTradesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const trades = await getTradesByDateRange(startDate, endDate);
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchTradeById = async (req, res) => {
  const { tradeId } = req.params;
  try {
    const trade = await getTradeById(tradeId);
    if (!trade) {
      res.status(404).json({ error: "Trade not found" });
    } else {
      res.status(200).json(trade);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchTradesByCriteria = async (req, res) => {
  try {
    const trades = await getTradesByCriteria(req.body);
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTrade = async (req, res) => {
  try {
    await insertTrade(req.body);
    res.status(201).json({ message: "Trade created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const modifyTrade = async (req, res) => {
  const { tradeId } = req.params;
  try {
    await updateTrade(tradeId, req.body);
    res.status(200).json({ message: "Trade updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeTrade = async (req, res) => {
  const { tradeId } = req.params;
  try {
    await deleteTradeById(tradeId);
    res.status(200).json({ message: "Trade deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
