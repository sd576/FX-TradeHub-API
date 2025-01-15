import {
  getAllSettlements,
  getSettlementsByCounterparty,
  getSettlementByCounterpartyAndCurrency,
  replaceSettlement,
  updateSettlement,
  deleteSettlement,
} from "../services/settlementService.js";

/**
 * Retrieve all settlements.
 */
export const fetchAllSettlements = async (req, res) => {
  try {
    const settlements = await getAllSettlements();
    res.status(200).json(settlements);
  } catch (err) {
    console.error("Error fetching all settlements:", err.message);
    res.status(500).json({ error: "Failed to fetch settlements" });
  }
};

/**
 * Retrieve settlements for a specific counterparty.
 */
export const fetchSettlementsByCounterparty = async (req, res) => {
  const { counterpartyId } = req.params;

  try {
    const settlements = await getSettlementsByCounterparty(counterpartyId);
    if (settlements.length === 0) {
      return res
        .status(404)
        .json({ error: "No settlements found for this counterparty" });
    }
    res.status(200).json(settlements);
  } catch (err) {
    console.error(
      `Error fetching settlements for counterparty ID ${counterpartyId}:`,
      err.message
    );
    res.status(500).json({ error: "Failed to fetch settlements" });
  }
};

/**
 * Retrieve settlement details for a specific counterparty and currency.
 */
export const fetchSettlementByCounterpartyAndCurrency = async (req, res) => {
  const { counterpartyId, currency } = req.params;

  try {
    const settlement = await getSettlementByCounterpartyAndCurrency(
      counterpartyId,
      currency
    );
    if (!settlement) {
      return res
        .status(404)
        .json({
          error: "No settlement found for this counterparty and currency",
        });
    }
    res.status(200).json(settlement);
  } catch (err) {
    console.error(
      `Error fetching settlement for counterparty ID ${counterpartyId} and currency ${currency}:`,
      err.message
    );
    res.status(500).json({ error: "Failed to fetch settlement" });
  }
};

/**
 * Replace settlement details for a specific counterparty and currency.
 */
export const replaceSettlementDetails = async (req, res) => {
  const { counterpartyId, currency } = req.params;
  const settlement = req.body;

  try {
    await replaceSettlement(settlement, counterpartyId, currency);
    res.status(200).json({ message: "Settlement replaced successfully" });
  } catch (err) {
    console.error(
      `Error replacing settlement for counterparty ID ${counterpartyId} and currency ${currency}:`,
      err.message
    );
    if (err.message === "Settlement not found") {
      res.status(404).json({ error: "Settlement not found" });
    } else {
      res.status(500).json({ error: "Failed to replace settlement" });
    }
  }
};

/**
 * Partially update settlement details for a specific counterparty and currency.
 */
export const updateSettlementDetails = async (req, res) => {
  const { counterpartyId, currency } = req.params;
  const updates = req.body;

  try {
    await updateSettlement(updates, counterpartyId, currency);
    res.status(200).json({ message: "Settlement updated successfully" });
  } catch (err) {
    console.error(
      `Error updating settlement for counterparty ID ${counterpartyId} and currency ${currency}:`,
      err.message
    );
    if (err.message === "Settlement not found") {
      res.status(404).json({ error: "Settlement not found" });
    } else {
      res.status(500).json({ error: "Failed to update settlement" });
    }
  }
};

/**
 * Delete settlement details for a specific counterparty and currency.
 */
export const deleteSettlementDetails = async (req, res) => {
  const { counterpartyId, currency } = req.params;

  try {
    await deleteSettlement(counterpartyId, currency);
    res.status(200).json({ message: "Settlement deleted successfully" });
  } catch (err) {
    console.error(
      `Error deleting settlement for counterparty ID ${counterpartyId} and currency ${currency}:`,
      err.message
    );
    if (err.message === "Settlement not found") {
      res.status(404).json({ error: "Settlement not found" });
    } else {
      res.status(500).json({ error: "Failed to delete settlement" });
    }
  }
};
