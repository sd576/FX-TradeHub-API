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
    const createdNostroAccount = await createNostroAccount(req.body);

    if (!createdNostroAccount || !createdNostroAccount.id) {
      return res.status(400).json({ error: "Failed to create Nostro Account" });
    }

    res.status(201).json({
      message: "Nostro Account created successfully",
      id: createdNostroAccount.id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Update (PUT) a Nostro Account
export const updateNostroAccountController = async (req, res) => {
  const { id } = req.params;

  try {
    // Prevent updating the ID field
    if (req.body.id && req.body.id !== id) {
      return res.status(400).json({
        error:
          "Updating 'id' is not allowed. Use DELETE and POST to create a new Nostro Account.",
      });
    }

    // Check if the Nostro Account exists before updating
    const existingNostroAccount = await getNostroAccountById(id);
    if (!existingNostroAccount) {
      return res.status(404).json({ error: "Nostro Account not found" });
    }

    // Perform the update
    await updateNostroAccount(id, req.body);

    // Fetch the updated record
    const updatedNostroAccount = await getNostroAccountById(id);
    res.status(200).json(updatedNostroAccount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Patch (PATCH) a Nostro Account
export const patchNostroAccountController = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`[🛠️ PATCH Controller] Incoming PATCH request for ID: ${id}`);
    console.log("[🔍 PATCH Payload Received]", req.body);

    // ✅ Ensure request body is not empty
    if (!Object.keys(req.body).length) {
      console.error("[❌ ERROR] No fields provided for update.");
      return res.status(400).json({ error: "No fields to update." });
    }

    // ✅ Ensure `id` is not being updated
    if (req.body.id && req.body.id !== id) {
      console.error(
        "[❌ ERROR] Attempted to update 'id'. This is not allowed."
      );
      return res.status(400).json({ error: "Updating 'id' is not allowed." });
    }

    // ✅ Check if the Nostro Account exists
    const existingNostroAccount = await getNostroAccountById(id);
    if (!existingNostroAccount) {
      console.error("[❌ ERROR] Nostro Account not found.");
      return res.status(404).json({ error: "Nostro Account not found" });
    }

    // ✅ Perform the PATCH update
    await patchNostroAccount(id, req.body);

    // ✅ Fetch the updated record
    const updatedNostroAccount = await getNostroAccountById(id);
    console.log(
      "[✅ SUCCESS] PATCH - Updated Nostro Account:",
      updatedNostroAccount
    );

    res.status(200).json(updatedNostroAccount);
  } catch (error) {
    console.error(
      "[❌ ERROR] Unexpected error in PATCH controller:",
      error.message
    );
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a Nostro Account
export const deleteNostroAccountController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteNostroAccount(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Nostro Account" });
  }
};
