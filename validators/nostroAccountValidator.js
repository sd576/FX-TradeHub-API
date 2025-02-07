import { body, param } from "express-validator";

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

// ✅ Ensure `validateNostroParams` correctly validates all fields
export const validateNostroParams = [
  body("id").optional().isString().withMessage("ID must be a string"),
  body("counterpartyId").notEmpty().withMessage("Counterparty ID is required"),
  body("currency").notEmpty().withMessage("Currency is required"),
  body("nostroAccountId")
    .notEmpty()
    .withMessage("Nostro Account ID is required"),
  body("nostroDescription")
    .notEmpty()
    .withMessage("Nostro Description is required"),
  body("managedById").notEmpty().withMessage("Managed By ID is required"),
];

// ✅ Validation for `GET /api/nostro-accounts/counterparty/:counterpartyId`
export const validateCounterpartyId = [
  param("counterpartyId")
    .notEmpty()
    .withMessage("Counterparty ID is required")
    .isString()
    .withMessage("Counterparty ID must be a string"),
];
