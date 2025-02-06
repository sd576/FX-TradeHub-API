import { body } from "express-validator";

export const patchNostroAccountValidator = [
  body("counterpartyId")
    .optional()
    .isString()
    .withMessage("Counterparty ID must be a string"),
  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string"),
  body("nostroAccountId")
    .optional()
    .isString()
    .withMessage("Nostro Account ID must be a string"),
  body("nostroDescription")
    .optional()
    .isString()
    .withMessage("Nostro Description must be a string"),
  body("managedById")
    .optional()
    .isString()
    .withMessage("Managed By ID must be a string"),
];

// If validateNostroParams doesn't exist, either define it or remove its import
export const validateNostroParams = [
  body("id").optional().isString().withMessage("ID must be a string"),
];
