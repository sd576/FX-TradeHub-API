import {
  getAllNostroAccounts,
  getNostroAccountById,
  createNostroAccount,
  updateNostroAccount,
  patchNostroAccount,
  deleteNostroAccount,
} from "../services/nostroAccountService.js";

// ✅ Fetch all Nostro Accounts
export const getAllNostroAccountsController = async (req, res) => {
  try {
    const nostroAccounts = await getAllNostroAccounts();
    res.status(200).json(nostroAccounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Fetch a single Nostro Account by ID
export const getNostroAccountByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const nostroAccount = await getNostroAccountById(id);
    if (!nostroAccount) {
      return res.status(404).json({ error: "Nostro Account not found" });
    }
    res.status(200).json(nostroAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a new Nostro Account
export const createNostroAccountController = async (req, res) => {
  try {
    await createNostroAccount(req.body);
    res.status(201).json({ message: "Nostro Account created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Update (PUT) a Nostro Account
export const updateNostroAccountController = async (req, res) => {
  const { id } = req.params;
  try {
    await updateNostroAccount(id, req.body);
    res.status(200).json({ message: "Nostro Account updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Patch (PATCH) a Nostro Account
export const patchNostroAccountController = async (req, res) => {
  const { id } = req.params;
  try {
    await patchNostroAccount(id, req.body);
    res.status(200).json({ message: "Nostro Account updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a Nostro Account
export const deleteNostroAccountController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteNostroAccount(id);
    res.status(200).json({ message: "Nostro Account deleted successfully." });
  } catch (error) {
    res.status(404).json({ error: "Nostro Account not found." });
  }
};
