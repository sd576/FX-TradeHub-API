/**
 * Generates the far leg trade details based on the near leg.
 * @param {Object} trade - The original near leg trade.
 * @returns {Object} - The generated far leg trade.
 */
export const generateFarLegTrade = (trade) => {
  return {
    tradeId: `${trade.tradeId}-FAR`,
    tradeType: "SWAP",
    tradeDate: trade.tradeDate,
    settlementDate: formatDate(
      new Date(
        new Date(trade.settlementDate).setMonth(
          new Date(trade.settlementDate).getMonth() + 1
        )
      )
    ),
    weBuyWeSell: trade.weBuyWeSell === "we buy" ? "we sell" : "we buy",
    counterpartyId: trade.counterpartyId,
    buyCurrency: trade.sellCurrency,
    sellCurrency: trade.buyCurrency,
    buyAmount: trade.sellAmount,
    sellAmount: trade.buyAmount,
    exchangeRate: parseFloat((trade.exchangeRate * 1.0003).toFixed(6)),
    buyNostroAccountId: trade.sellNostroAccountId,
    sellNostroAccountId: trade.buyNostroAccountId,
    buyNostroDescription: trade.sellNostroDescription,
    sellNostroDescription: trade.buyNostroDescription,
  };
};

/**
 * Utility to format data as 'YYYY-MM-DD'
 * @param {Date} date
 * @returns {string} Formatted date.
 */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};
