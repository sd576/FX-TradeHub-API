import { Router } from "express";
import { validationResult } from "express-validator";
import {
  getAllCounterpartiesController,
  getCounterpartyByIdController,
  createCounterpartyController,
  modifyCounterpartyController,
  patchCounterpartyController,
  deleteCounterpartyController,
} from "../controllers/counterpartyController.js";

import {
  validateCounterparty,
  validatePatchCounterparty,
} from "../validators/counterpartyValidator.js";

const router = Router();

// Retrieve all counterparties
router.get("/", getAllCounterpartiesController);

// Retrieve a single counterparty by ID
router.get("/:id", getCounterpartyByIdController);

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
  createCounterpartyController
);

// Update an existing counterparty
router.put("/:id", modifyCounterpartyController);

// Partial update to an existing counterparty
router.patch(
  "/:id",
  validatePatchCounterparty,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  patchCounterpartyController
);

// Delete a counterparty
router.delete("/:id", deleteCounterpartyController);

export default router;
