import { check } from "express-validator";

// Validation rules for settlement parameters
export const validateNostroParams = [
  check("counterpartyId")
    .isString()
    .withMessage("Counterparty ID must be a string"),
  check("currency")
    .isString()
    .isLength({ max: 3 })
    .withMessage("Currency must be a valid 3-letter code"),
];
