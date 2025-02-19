import { check } from "express-validator";

// Validation rules for trade data
export const validateTrade = [
  check("tradeId").isString().withMessage("Trade ID must be a string"),
  check("tradeType")
    .isString()
    .isIn(["SPOT", "FORWARD", "SWAP"])
    .withMessage("Trade type must be one of 'SPOT', 'FORWARD', or 'SWAP'"),
  check("tradeDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Trade date must be in YYYY-MM-DD format"),
  check("settlementDate")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Settlement date must be in YYYY-MM-DD format"),
  check("weBuyWeSell")
    .isString()
    .isIn(["we buy", "we sell"])
    .withMessage("We Buy/We Sell must be either 'we buy' or 'we sell'"),
  check("counterpartyId")
    .isString()
    .withMessage("Counterparty ID must be a string"),
  check("buyCurrency")
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Buy currency must be a valid 3-letter currency code"),
  check("sellCurrency")
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Sell currency must be a valid 3-letter currency code"),
  check("buyAmount")
    .isFloat({ gt: 0 })
    .withMessage("Buy amount must be a positive number"),
  check("sellAmount")
    .isFloat({ gt: 0 })
    .withMessage("Sell amount must be a positive number"),
  check("exchangeRate")
    .isFloat({ gt: 0 })
    .withMessage("Exchange rate must be a positive number"),
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
