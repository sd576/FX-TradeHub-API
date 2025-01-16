import {
  getAllTrades,
  getTradesByCounterparty,
  getTradesByDateRange,
  getTradeById,
  insertTrade,
  deleteTradeById,
} from "../../services/tradeService.js";

const testTrades = async () => {
  try {
    console.log("Fetching all trades:");
    console.log(await getAllTrades());

    console.log("Fetching trades for counterparty 'COUNTERPARTY-001':");
    console.log(await getTradesByCounterparty("COUNTERPARTY-001"));

    console.log("Fetching trades by date range:");
    console.log(await getTradesByDateRange("2025-01-01", "2025-01-31"));

    console.log("Fetching trade by ID 'TRADE-001':");
    console.log(await getTradeById("TRADE-001"));

    console.log("Inserting a new trade:");
    await insertTrade({
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
    });

    console.log("Deleting trade with ID 'TRADE-002':");
    await deleteTradeById("TRADE-002");
  } catch (err) {
    console.error("Error testing trades:", err.message);
  }
};

testTrades();
