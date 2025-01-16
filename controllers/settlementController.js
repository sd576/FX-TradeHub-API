import {
  getAllSettlements,
  getSettlementsByCounterparty,
  getSettlementByCounterpartyAndCurrency,
  replaceSettlement,
  deleteSettlement,
} from "../services/settlementService.js";

export const fetchAllSettlements = async (req, res) => {
  try {
    const settlements = await getAllSettlements();
    res.status(200).json(settlements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchSettlementsByCounterparty = async (req, res) => {
  const { counterpartyId } = req.params;
  try {
    const settlements = await getSettlementsByCounterparty(counterpartyId);
    if (!settlements.length) {
      return res.status(404).json({ error: "No settlements found" });
    }
    res.status(200).json(settlements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchSettlementByCounterpartyAndCurrency = async (req, res) => {
  const { counterpartyId, currency } = req.params;
  try {
    const settlement = await getSettlementByCounterpartyAndCurrency(
      counterpartyId,
      currency
    );
    if (!settlement) {
      return res.status(404).json({ error: "Settlement not found" });
    }
    res.status(200).json(settlement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettlement = async (req, res) => {
  const { counterpartyId, currency } = req.params;
  try {
    await replaceSettlement(req.body, counterpartyId, currency);
    res.status(200).json({ message: "Settlement updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeSettlement = async (req, res) => {
  const { counterpartyId, currency } = req.params;
  try {
    await deleteSettlement(counterpartyId, currency);
    res.status(200).json({ message: "Settlement deleted successfully" });
  } catch (error) {
    if (error.message === "Settlement not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
