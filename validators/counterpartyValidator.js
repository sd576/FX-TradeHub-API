import { check } from "express-validator";

// Validation rules for creating a counterparty
export const validateCounterparty = [
  check("id")
    .isString()
    .isLength({ max: 20 })
    .withMessage("ID must be a string with a maximum length of 20"),
  check("name")
    .isString()
    .isLength({ max: 100 })
    .withMessage("Name must be a string with a maximum length of 100"),
  check("email").isEmail().withMessage("Email must be a valid email address"),
  check("city")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("City must be a string with a maximum length of 50"),
  check("country")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("Country must be a string with a maximum length of 50"),
  check("currency")
    .isString()
    .isLength({ max: 3 })
    .withMessage("Currency must be a valid 3-letter code"),
  check("accountNumber")
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage("Account number must be a string with a maximum length of 20"),
  check("swiftCode")
    .optional()
    .isString()
    .isLength({ max: 11 })
    .withMessage("SWIFT code must be a string with a maximum length of 11"),
  check("contactPerson")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("Contact person must be a string with a maximum length of 50"),
  check("phone")
    .optional()
    .isString()
    .isLength({ max: 15 })
    .withMessage("Phone number must be a string with a maximum length of 15"),
];
