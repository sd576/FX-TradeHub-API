import { writeFileSync } from "fs";
import path from "path";
import { counterpartyData } from "../dataSeeding/counterpartyData.js";

// Fixed currency pairs and spreads
const currencyPairs = [
  { pair: "EUR/USD", bid: "1.0934", offer: "1.0936" },
  { pair: "GBP/USD", bid: "1.2620", offer: "1.2623" },
  { pair: "USD/JPY", bid: "147.2200", offer: "147.2250" },
  { pair: "AUD/USD", bid: "0.6390", offer: "0.6393" },
  { pair: "NZD/USD", bid: "0.5935", offer: "0.5938" },
  { pair: "EUR/GBP", bid: "0.8654", offer: "0.8656" },
  { pair: "GBP/JPY", bid: "185.1250", offer: "185.1300" },
  { pair: "USD/CAD", bid: "1.3478", offer: "1.3481" },
];

// Counterparty Lookup
const counterpartyLookup = Object.fromEntries(
  counterpartyData.map((cpty) => [cpty.id, cpty])
);

// Generate Trade Data
const generateTrades = (count, tradeType, nearDate, farDate = null) => {
  const trades = [];
  const myBankId = "999";
  const myBankDetails = counterpartyLookup[myBankId];

  for (let i = 1; i <= count; i++) {
    const counterpartyId = counterpartyData[i % counterpartyData.length].id;
    const currency = currencyPairs[i % currencyPairs.length];
    const counterparty = counterpartyLookup[counterpartyId];
    const weBuyWeSell = Math.random() < 0.5 ? "we buy" : "we sell";

    // Handle Buy Nostro Account
    const buyNostroAccount =
      weBuyWeSell === "we buy" &&
      counterparty.nostroAccounts[currency.pair.split("/")[0]]
        ? {
            id: counterparty.nostroAccounts[currency.pair.split("/")[0]],
            description: `${counterparty.name}, ${counterparty.city}`,
          }
        : myBankDetails.nostroAccounts["GBP"]
        ? {
            id: myBankDetails.nostroAccounts["GBP"],
            description: `${
              counterpartyLookup[myBankDetails.nostroAccounts["GBP"]]?.name ||
              "Global Trade Bank"
            }, ${
              counterpartyLookup[myBankDetails.nostroAccounts["GBP"]]?.city ||
              "London"
            }`,
          }
        : {
            id: "N/A",
            description: "No valid nostro account found for GBP",
          };

    // Handle Sell Nostro Account
    const sellNostroAccount =
      weBuyWeSell === "we sell" &&
      counterparty.nostroAccounts[currency.pair.split("/")[1]]
        ? {
            id: counterparty.nostroAccounts[currency.pair.split("/")[1]],
            description: `${counterparty.name}, ${counterparty.city}`,
          }
        : myBankDetails.nostroAccounts["GBP"]
        ? {
            id: myBankDetails.nostroAccounts["GBP"],
            description: `${
              counterpartyLookup[myBankDetails.nostroAccounts["GBP"]]?.name ||
              "Global Trade Bank"
            }, ${
              counterpartyLookup[myBankDetails.nostroAccounts["GBP"]]?.city ||
              "London"
            }`,
          }
        : {
            id: "N/A",
            description: "No valid nostro account found for GBP",
          };

    // Create Trade
    const trade = {
      tradeId: `${tradeType}-${counterpartyId}-${String(i).padStart(3, "0")}`,
      tradeDate: "2025-01-01",
      tradeType,
      weBuyWeSell,
      counterpartyDescription: `${counterparty.name}, ${counterparty.city}`,
      counterpartyId,
      counterpartyName: counterparty.name,
      settlementDate: nearDate,
      buyCurrency: currency.pair.split("/")[0],
      sellCurrency: currency.pair.split("/")[1],
      buyAmount: 1000000,
      sellAmount: parseFloat((1000000 * parseFloat(currency.bid)).toFixed(2)),
      exchangeRate: parseFloat(currency.bid).toFixed(4),
      buyNostroAccount,
      sellNostroAccount,
    };

    // Add Far Leg for SWAPs
    if (tradeType === "SWAP" && farDate) {
      trade.farLeg = {
        tradeId: `${trade.tradeId}-FAR`,
        tradeDate: "2025-01-01",
        tradeType: "SWAP",
        counterpartyId,
        settlementDate: farDate,
        buyCurrency: currency.pair.split("/")[1],
        sellCurrency: currency.pair.split("/")[0],
        buyAmount: parseFloat(
          (1000000 * parseFloat(currency.offer)).toFixed(2)
        ),
        sellAmount: 1000000,
        exchangeRate: parseFloat(currency.offer).toFixed(4),
        buyNostroAccount,
        sellNostroAccount,
      };
    }

    trades.push(trade);
  }

  return trades;
};

// Generate Spot, Outright, and Swap Trades
const spotTradeData = generateTrades(100, "SPOT", "2025-01-02");
const outrightTradeData = generateTrades(100, "FWD", "2025-01-31");
const swapTradeData = generateTrades(100, "SWAP", "2025-01-31", "2025-03-01");

// Save to `generatedTradeOutput` folder
const outputFolder = path.join(
  "/Volumes/Stuarts Documents/fx_trader/fx_trader_server/generatedTradeOutput"
);
writeFileSync(
  path.join(outputFolder, "spotTradeData.json"),
  JSON.stringify(spotTradeData, null, 2)
);
writeFileSync(
  path.join(outputFolder, "outrightTradeData.json"),
  JSON.stringify(outrightTradeData, null, 2)
);
writeFileSync(
  path.join(outputFolder, "swapTradeData.json"),
  JSON.stringify(swapTradeData, null, 2)
);

console.log("Trade data files created in 'generatedTradeOutput'!");
