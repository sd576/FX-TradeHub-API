import { Router } from "express";
import { validationResult } from "express-validator";
import {
  getAllNostroAccountsController,
  getNostroAccountByIdController,
  createNostroAccountController,
  updateNostroAccountController,
  patchNostroAccountController,
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

// ✅ Retrieve a single Nostro account by ID
router.get("/:id", getNostroAccountByIdController); // 🆕 Correct route

// ✅ Update (replace) a Nostro account
router.put(
  "/:id",
  validateNostroParams,
  handleValidation,
  updateNostroAccountController
); // ✅ Fix incorrect reference

// ✅ Partially update a Nostro account
router.patch(
  "/:id",
  validateNostroParams,
  handleValidation,
  patchNostroAccountController
); // ✅ Fix incorrect reference

// ✅ Delete a Nostro account
router.delete("/:id", deleteNostroAccountController);

export default router;
