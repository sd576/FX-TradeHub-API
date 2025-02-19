export const buildTradeQuery = (whereClause = "") => `
    SELECT
        t.tradeId, t.tradeType, t.parentTradeId, t.tradeDate, t.settlementDate,
        t.weBuyWeSell, t.counterpartyId, t.buyCurrency, t.sellCurrency,
        t.buyAmount, t.sellAmount, t.exchangeRate,
        t.buyNostroAccountId, t.sellNostroAccountId,
        
        -- 🟢 Instead of 'Unknown', return 'Own Account' if it's the home currency
        CASE 
            WHEN nb.nostroDescription IS NULL AND t.buyCurrency = (SELECT currency FROM counterparties WHERE id = t.counterpartyId) 
            THEN 'Own Account'
            ELSE COALESCE(nb.nostroDescription, 'Unknown') 
        END AS buyNostroDescription,

        CASE 
            WHEN ns.nostroDescription IS NULL AND t.sellCurrency = (SELECT currency FROM counterparties WHERE id = t.counterpartyId) 
            THEN 'Own Account'
            ELSE COALESCE(ns.nostroDescription, 'Unknown') 
        END AS sellNostroDescription

    FROM trades t
    LEFT JOIN nostroAccounts nb ON t.buyNostroAccountId = nb.id
    LEFT JOIN nostroAccounts ns ON t.sellNostroAccountId = ns.id
    ${whereClause};
`;
