import { check, query } from "express-validator";

// Validate Trade ID
export const validateTradeId = [
  check("tradeId").isString().withMessage("Trade ID must be a string"),
];

// Validate Date Range for Trades
export const validateDateRange = [
  query("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  query("endDate")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
];

// Validate Trade Request Body
export const validateTrade = [
  check("tradeId").isString().withMessage("Trade ID must be a string"),
  check("tradeType")
    .isIn(["spot", "outright", "swap"])
    .withMessage("Trade type must be one of 'spot', 'outright', or 'swap'"),
  check("tradeDate")
    .isISO8601()
    .withMessage("Trade date must be a valid ISO 8601 date"),
  check("settlementDate")
    .isISO8601()
    .withMessage("Settlement date must be a valid ISO 8601 date"),
  check("buyCurrency")
    .isString()
    .isLength({ max: 3 })
    .withMessage("Buy currency must be a valid 3-letter code"),
  check("sellCurrency")
    .isString()
    .isLength({ max: 3 })
    .withMessage("Sell currency must be a valid 3-letter code"),
  check("buyAmount")
    .isFloat({ gt: 0 })
    .withMessage("Buy amount must be a positive number"),
  check("sellAmount")
    .isFloat({ gt: 0 })
    .withMessage("Sell amount must be a positive number"),
  check("exchangeRate")
    .isFloat({ gt: 0 })
    .withMessage("Exchange rate must be a positive number"),
];
