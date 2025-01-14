/**
 * Middleware to handle validation errors from express-validator.
 * If validation errors are present, it responds with a 400 status and the errors.
 * Otherwise, it proceeds to the next middleware/controller.
 */
import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
