import { check, checkSchema } from "express-validator";

// ✅ Validation for `POST` (Create) and `PUT` (Update)
export const validateCounterparty = [
  check("id")
    .optional() // 👈 ID is optional for PUT (should not be updated)
    .isString()
    .isLength({ max: 20 })
    .withMessage("ID must be a string with a maximum length of 20"),
  check("name")
    .optional() // 👈 Now optional for PUT
    .isString()
    .isLength({ max: 100 })
    .withMessage("Name must be a string with a maximum length of 100"),
  check("email")
    .optional() // 👈 Now optional for PUT
    .isEmail()
    .withMessage("Email must be a valid email address"),
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
    .optional() // 👈 Now optional for PUT
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

// ✅ Validation for `PATCH` (Partial Update)
export const validatePatchCounterparty = checkSchema({
  name: {
    optional: true,
    isString: true,
    isLength: { options: { max: 100 } },
    errorMessage: "Name must be a string with a maximum length of 100",
  },
  email: {
    optional: true,
    isEmail: true,
    errorMessage: "Email must be a valid email address",
  },
  city: {
    optional: true,
    isString: true,
    isLength: { options: { max: 50 } },
    errorMessage: "City must be a string with a maximum length of 50",
  },
  country: {
    optional: true,
    isString: true,
    isLength: { options: { max: 50 } },
    errorMessage: "Country must be a string with a maximum length of 50",
  },
  currency: {
    optional: true,
    isString: true,
    isLength: { options: { max: 3 } },
    errorMessage: "Currency must be a valid 3-letter code",
  },
  accountNumber: {
    optional: true,
    isString: true,
    isLength: { options: { max: 20 } },
    errorMessage: "Account number must be a string with a maximum length of 20",
  },
  swiftCode: {
    optional: true,
    isString: true,
    isLength: { options: { max: 11 } },
    errorMessage: "SWIFT code must be a string with a maximum length of 11",
  },
  contactPerson: {
    optional: true,
    isString: true,
    isLength: { options: { max: 50 } },
    errorMessage: "Contact person must be a string with a maximum length of 50",
  },
  phone: {
    optional: true,
    isString: true,
    isLength: { options: { max: 15 } },
    errorMessage: "Phone number must be a string with a maximum length of 15",
  },
});
