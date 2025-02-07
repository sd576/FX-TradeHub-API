import { Router } from "express";
import { validationResult } from "express-validator";

// ✅ Import Controllers
import {
  getAllCounterpartiesController,
  getCounterpartyByIdController,
  createCounterpartyController,
  modifyCounterpartyController,
  patchCounterpartyController,
  deleteCounterpartyController,
} from "../controllers/counterpartyController.js";

// ✅ Import Validators
import {
  validateCounterparty,
  validatePatchCounterparty,
} from "../validators/counterpartyValidator.js";

const router = Router();

// ✅ Helper middleware for validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ✅ Routes

// 🔹 Create a new Counterparty
router.post(
  "/",
  validateCounterparty,
  handleValidation, // ✅ Use helper function for cleaner code
  createCounterpartyController
);

// 🔹 Retrieve all Counterparties
router.get("/", getAllCounterpartiesController);

// 🔹 Retrieve a single Counterparty by ID
router.get("/:id", getCounterpartyByIdController);

// 🔹 Update (replace) a Counterparty (PUT)
router.put(
  "/:id",
  validateCounterparty,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(
        "[❌ PUT Validation Error] Received invalid data:",
        errors.array()
      );
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  modifyCounterpartyController
);

// 🔹 Partially update a Counterparty (PATCH)
router.patch(
  "/:id",
  validatePatchCounterparty,
  handleValidation,
  patchCounterpartyController
);

// 🔹 Delete a Counterparty
router.delete("/:id", deleteCounterpartyController);

export default router;
