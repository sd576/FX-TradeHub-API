import { Router } from "express";
import { validationResult } from "express-validator";

// ✅ Import Controllers
import {
  getAllNostroAccountsController,
  getNostroAccountsByCounterpartyController,
  getNostroAccountByIdController,
  createNostroAccountController,
  updateNostroAccountController,
  patchNostroAccountController,
  deleteNostroAccountController,
} from "../controllers/nostroAccountController.js";

// ✅ Import Validators
import {
  validateNostroParams,
  validateCounterpartyId,
} from "../validators/nostroAccountValidator.js";

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

// 🔹 Create a new Nostro account
router.post("/", createNostroAccountController);

// 🔹 Retrieve all Nostro accounts
router.get("/", getAllNostroAccountsController);

// 🔹 Retrieve Nostro accounts by Counterparty ID
router.get(
  "/counterparty/:counterpartyId",
  validateCounterpartyId, // ✅ Validate param
  handleValidation,
  getNostroAccountsByCounterpartyController
);

// 🔹 Retrieve a single Nostro account by ID
router.get("/:id", getNostroAccountByIdController);

// 🔹 Update (replace) a Nostro account
router.put(
  "/:id",
  validateNostroParams,
  handleValidation,
  updateNostroAccountController
);

// 🔹 Partially update a Nostro account
router.patch(
  "/:id",
  validateNostroParams,
  handleValidation,
  patchNostroAccountController
);

// 🔹 Delete a Nostro account
router.delete("/:id", deleteNostroAccountController);

export default router;
