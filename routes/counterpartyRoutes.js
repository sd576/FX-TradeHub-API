import { Router } from "express";
import { validationResult } from "express-validator";
import {
  fetchAllCounterparties,
  fetchCounterpartyById,
  createCounterparty,
  modifyCounterparty,
  removeCounterparty,
} from "../controllers/counterpartyController.js";
import { validateCounterparty } from "../validators/counterpartyValidator.js";

const router = Router();

// Retrieve all counterparties
router.get("/", fetchAllCounterparties);

// Retrieve a single counterparty by ID
router.get("/:id", fetchCounterpartyById);

// Add a new counterparty with validation
router.post(
  "/",
  validateCounterparty,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createCounterparty
);

// Update an existing counterparty
router.put("/:id", modifyCounterparty);

// Delete a counterparty
router.delete("/:id", removeCounterparty);

export default router;
