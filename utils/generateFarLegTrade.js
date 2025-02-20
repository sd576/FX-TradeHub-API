/**
 * Generates the far leg trade details based on the near leg.
 * @param {Object} trade - The original near leg trade.
 * @returns {Object} - The generated far leg trade.
 */
export const generateFarLegTrade = (trade) => {
  console.log(`🚀 Generating Far Leg for ${trade.tradeId}`);

  // ✅ Prevent double-appending "-FAR" if already a far leg
  if (trade.tradeId.includes("-FAR")) {
    console.warn(
      `⚠️ Far leg already exists: ${trade.tradeId}. Skipping re-generation.`
    );
    return trade; // Return unchanged to prevent duplicates
  }

  return {
    tradeType: "SWAP",
    tradeId: `${trade.tradeId}-FAR`,
    parentTradeId: trade.tradeId,
    tradeDate: trade.settlementDate,
    settlementDate: trade.settlementDate,
    weBuyWeSell: trade.weBuyWeSell === "we buy" ? "we sell" : "we buy",
    counterpartyId: trade.counterpartyId,
    buyCurrency: trade.sellCurrency,
    sellCurrency: trade.buyCurrency,
    buyAmount: trade.sellAmount,
    sellAmount: trade.buyAmount,
    exchangeRate: 1 / trade.exchangeRate,
    buyNostroAccountId: trade.sellNostroAccountId,
    sellNostroAccountId: trade.buyNostroAccountId,
  };
};
