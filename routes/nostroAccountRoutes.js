import { Router } from "express";
import { validationResult } from "express-validator";
import {
  getAllNostroAccountsController,
  getNostrosByCounterpartyController,
  getNostroByCounterpartyAndCurrencyController,
  createNostroAccountController,
  updateNostro,
  patchNostro,
  deleteNostroAccountController,
} from "../controllers/nostroAccountController.js";
import { validateNostroParams } from "../validators/nostroAccountValidator.js";

const router = Router();

// Helper middleware for validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ✅ Create a new Nostro account
router.post("/", createNostroAccountController);

// ✅ Retrieve all Nostro accounts
router.get("/", getAllNostroAccountsController);

// ✅ Retrieve Nostro accounts by counterparty ID
router.get("/:counterpartyId", getNostrosByCounterpartyController);

// ✅ Retrieve a single Nostro account by counterparty ID and currency
router.get(
  "/:counterpartyId/:currency",
  validateNostroParams,
  handleValidation,
  getNostroByCounterpartyAndCurrencyController
);

// ✅ Update (replace) a Nostro account
router.put(
  "/:counterpartyId/:currency",
  validateNostroParams,
  handleValidation,
  updateNostro
);

// ✅ Partially update a Nostro account
router.patch("/:id", patchNostro);

// ✅ Delete a Nostro account
router.delete(
  "/:counterpartyId/:currency",
  validateNostroParams,
  handleValidation,
  deleteNostroAccountController
);

export default router;
