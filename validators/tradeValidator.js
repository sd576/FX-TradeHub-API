import { check, body } from "express-validator";

// 🚀 Trade Validation Rules
export const validateTrade = [
  // 🔒 Trade ID (Immutable & Required)
  check("tradeId")
    .isString()
    .notEmpty()
    .withMessage("Trade ID must be a non-empty string"),

  // 📌 Trade Type (Must be SPOT, FORWARD, or SWAP)
  check("tradeType")
    .isString()
    .isIn(["SPOT", "FORWARD", "SWAP"])
    .withMessage("Trade type must be one of 'SPOT', 'FORWARD', or 'SWAP'"),

  // 📅 Trade Date & Settlement Date
  check("tradeDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Trade date must be in YYYY-MM-DD format"),
  check("settlementDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Settlement date must be in YYYY-MM-DD format"),
  body("tradeDate").custom((tradeDate, { req }) => {
    if (new Date(tradeDate) >= new Date(req.body.settlementDate)) {
      throw new Error("Trade date must be before settlement date");
    }
    return true;
  }),

  // 🔄 We Buy/We Sell (Must be "we buy" or "we sell")
  check("weBuyWeSell")
    .isString()
    .isIn(["we buy", "we sell"])
    .withMessage("We Buy/We Sell must be either 'we buy' or 'we sell'"),

  // 🏦 Counterparty ID (Required)
  check("counterpartyId")
    .isString()
    .notEmpty()
    .withMessage("Counterparty ID is required"),

  // 💱 Currency Codes (ISO 3-letter)
  check("buyCurrency")
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Buy currency must be a valid 3-letter currency code"),
  check("sellCurrency")
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Sell currency must be a valid 3-letter currency code"),
  body("buyCurrency").custom((buyCurrency, { req }) => {
    if (buyCurrency === req.body.sellCurrency) {
      throw new Error("Buy currency and Sell currency must be different");
    }
    return true;
  }),

  // 💰 Amounts & Exchange Rate (Must be positive)
  check("buyAmount")
    .isFloat({ gt: 0 })
    .withMessage("Buy amount must be a positive number"),
  check("sellAmount")
    .isFloat({ gt: 0 })
    .withMessage("Sell amount must be a positive number"),
  check("exchangeRate")
    .isFloat({ gt: 0 })
    .withMessage("Exchange rate must be a positive number"),

  // ✅ Log warning if Sell Amount does not match Buy Amount * Exchange Rate
  body().custom((trade) => {
    const calculatedSellAmount = trade.buyAmount * trade.exchangeRate;
    if (Math.abs(trade.sellAmount - calculatedSellAmount) > 0.01) {
      console.warn(
        `⚠️ MISMATCH: Trade ${trade.tradeId} - Expected SellAmount: ${calculatedSellAmount.toFixed(2)}, Received: ${trade.sellAmount}`
      );
    }
    return true;
  }),

  // 🔗 Parent Trade ID for SWAP Trades (Ensures Far Leg is Linked)
  body("parentTradeId").custom((parentTradeId, { req }) => {
    if (req.body.tradeType === "SWAP" && !parentTradeId) {
      throw new Error("SWAP trades must have a parentTradeId");
    }
    return true;
  }),

  // 🏦 Nostro Accounts & Descriptions (Optional but Validated)
  check("buyNostroAccountId")
    .optional()
    .isString()
    .withMessage("Buy Nostro Account ID must be a string"),
  check("sellNostroAccountId")
    .optional()
    .isString()
    .withMessage("Sell Nostro Account ID must be a string"),
  check("buyNostroDescription")
    .optional()
    .isString()
    .withMessage("Buy Nostro Description must be a string"),
  check("sellNostroDescription")
    .optional()
    .isString()
    .withMessage("Sell Nostro Description must be a string"),
];
