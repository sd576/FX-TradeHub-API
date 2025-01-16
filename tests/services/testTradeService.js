import {
  getAllTrades,
  getTradesByCounterparty,
  getTradesByDateRange,
  getTradeById,
  getTradesByCriteria,
  insertTrade,
  updateTrade,
  deleteTradeById,
} from "../../services/tradeService.js";

const testTradeService = async () => {
  try {
    console.log("Testing getAllTrades:");
    const allTrades = await getAllTrades();
    console.log(allTrades);

    console.log(
      "Testing getTradesByCounterparty (Counterparty ID: 'COUNTERPARTY-001'):"
    );
    const tradesByCounterparty = await getTradesByCounterparty(
      "COUNTERPARTY-001"
    );
    console.log(tradesByCounterparty);

    console.log("Testing getTradesByDateRange (2025-01-01 to 2025-01-31):");
    const tradesByDate = await getTradesByDateRange("2025-01-01", "2025-01-31");
    console.log(tradesByDate);

    console.log("Testing getTradeById (Trade ID: 'TRADE-001'):");
    const tradeById = await getTradeById("TRADE-001");
    console.log(tradeById);

    console.log(
      "Testing getTradesByCriteria (buyCurrency: 'USD', sellCurrency: 'EUR'):"
    );
    const tradesByCriteria = await getTradesByCriteria({
      buyCurrency: "USD",
      sellCurrency: "EUR",
    });
    console.log(tradesByCriteria);

    console.log("Testing insertTrade:");
    const newTrade = {
      tradeId: "TRADE-002",
      tradeType: "SPOT",
      parentTradeId: null,
      tradeDate: "2025-01-15",
      settlementDate: "2025-01-17",
      weBuyWeSell: "we sell",
      counterpartyId: "COUNTERPARTY-002",
      buyCurrency: "EUR",
      sellCurrency: "USD",
      buyAmount: 800000,
      sellAmount: 720000,
      exchangeRate: 1.1,
      buyNostroAccountId: "NOSTRO-003",
      sellNostroAccountId: "NOSTRO-004",
    };
    await insertTrade(newTrade);
    console.log("Trade inserted successfully!");

    console.log("Testing updateTrade:");
    const updatedTrade = {
      ...newTrade,
      buyAmount: 850000,
      sellAmount: 765000,
    };
    await updateTrade(newTrade.tradeId, updatedTrade);
    console.log("Trade updated successfully!");

    console.log("Testing deleteTradeById (Trade ID: 'TRADE-002'):");
    await deleteTradeById("TRADE-002");
    console.log("Trade deleted successfully!");
  } catch (err) {
    console.error("Error during trade service tests:", err.message);
  }
};

testTradeService();
