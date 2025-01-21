import { Router } from "express";
import { validationResult } from "express-validator";
import {
  getAllCounterparties,
  getCounterpartyById,
  createCounterparty,
  modifyCounterparty,
  patchCounterpartyById,
  removeCounterparty,
} from "../controllers/counterpartyController.js";
import { validateCounterparty } from "../validators/counterpartyValidator.js";

const router = Router();

// Retrieve all counterparties
router.get("/", getAllCounterparties);

// Retrieve a single counterparty by ID
router.get("/:id", getCounterpartyById);

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

// Partial update to an existing counterparty
router.patch("/:id", patchCounterpartyById);

// Delete a counterparty
router.delete("/:id", removeCounterparty);

export default router;
