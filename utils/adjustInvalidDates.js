/**
 * adjustInvalidDates.js
 *
 * This script adjusts invalid dates in trade data files. It ensures:
 * - No more than 31 days in a month.
 * - No more than 12 months in a year.
 *
 * Use this script to sanitize trade data files in the `dataSeeding` folder.
 */

import fs from "fs";
import path from "path";

const dataSeedingPath = path.resolve("dataSeeding");
const files = [
  "spotTradeData.json",
  "outrightTradeData.json",
  "swapNearTradeData.json",
  "swapFarTradeData.json",
];

// Function to adjust invalid dates
const adjustDates = (dateString) => {
  let [year, month, day] = dateString.split("-").map(Number);

  while (day > 28) {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get days in the current month
    if (day > daysInMonth) {
      day -= daysInMonth;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    } else {
      break;
    }
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

files.forEach((file) => {
  const filePath = path.join(dataSeedingPath, file);

  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}. Creating with default data.`);
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let updated = false;

  const adjustedData = data.map((trade) => {
    const originalTradeDate = trade.tradeDate;
    const originalSettlementDate = trade.settlementDate;

    trade.tradeDate = adjustDates(trade.tradeDate);
    trade.settlementDate = adjustDates(trade.settlementDate);

    if (trade.nearDate) {
      trade.nearDate = adjustDates(trade.nearDate);
    }

    if (trade.farDate) {
      trade.farDate = adjustDates(trade.farDate);
    }

    if (
      originalTradeDate !== trade.tradeDate ||
      originalSettlementDate !== trade.settlementDate
    ) {
      updated = true;
    }

    return trade;
  });

  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(adjustedData, null, 2), "utf-8");
    console.log(`Adjusted invalid dates in ${file}`);
  } else {
    console.log(`No invalid dates found in ${file}`);
  }
});
