import {
  getAllSettlements,
  getSettlementsByCounterparty,
  getSettlementByCounterpartyAndCurrency,
  replaceSettlement,
  patchSettlement as patchSettlementService,
  deleteSettlement,
} from "../services/settlementService.js";

const handleControllerError = (res, error, defaultMessage) => {
  res.status(500).json({
    error: true,
    message: error.message || defaultMessage,
  });
};

export const getAllSettlementsController = async (req, res) => {
  try {
    const settlements = await getAllSettlements();
    res.status(200).json(settlements);
  } catch (error) {
    handleControllerError(res, error, "Failed to fetch settlements");
  }
};

export const getSettlementsByCounterpartyController = async (req, res) => {
  const { counterpartyId } = req.params;
  try {
    const settlements = await getSettlementsByCounterparty(counterpartyId);
    if (!settlements.length) {
      return res
        .status(404)
        .json({ error: true, message: "No settlements found" });
    }
    res.status(200).json(settlements);
  } catch (error) {
    handleControllerError(
      res,
      error,
      "Failed to fetch settlements by counterparty"
    );
  }
};

export const getSettlementByCounterpartyAndCurrencyController = async (
  req,
  res
) => {
  const { counterpartyId, currency } = req.params;
  try {
    const settlement = await getSettlementByCounterpartyAndCurrency(
      counterpartyId,
      currency
    );
    if (!settlement) {
      return res
        .status(404)
        .json({ error: true, message: "Settlement not found" });
    }
    res.status(200).json(settlement);
  } catch (error) {
    handleControllerError(res, error, "Failed to fetch settlement");
  }
};

export const patchSettlement = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (!Object.keys(updates).length) {
      return res
        .status(400)
        .json({ error: true, message: "No fields to update" });
    }

    await patchSettlementService(id, updates);
    res.status(200).json({ message: "Settlement updated successfully" });
  } catch (error) {
    handleControllerError(res, error, "Failed to patch settlement");
  }
};

export const updateSettlement = async (req, res) => {
  const { counterpartyId, currency } = req.params;
  try {
    await replaceSettlement(req.body, counterpartyId, currency);
    res.status(200).json({ message: "Settlement updated successfully" });
  } catch (error) {
    handleControllerError(res, error, "Failed to update settlement");
  }
};

export const removeSettlement = async (req, res) => {
  const { counterpartyId, currency } = req.params;
  try {
    await deleteSettlement(counterpartyId, currency);
    res.status(200).json({ message: "Settlement deleted successfully" });
  } catch (error) {
    if (error.message === "Settlement not found") {
      res.status(404).json({ error: true, message: error.message });
    } else {
      handleControllerError(res, error, "Failed to delete settlement");
    }
  }
};
