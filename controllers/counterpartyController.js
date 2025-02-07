import {
  getAllCounterparties,
  getCounterpartyById,
  createCounterparty,
  updateCounterparty,
  patchCounterparty,
  deleteCounterparty,
} from "../services/counterpartyService.js";

// 🔹 Retrieve all Counterparties
export const getAllCounterpartiesController = async (req, res) => {
  try {
    const counterparties = await getAllCounterparties();

    if (!counterparties || counterparties.length === 0) {
      console.warn("⚠️ No counterparties found, returning 404.");
      return res.status(404).json({ error: "No counterparties found" });
    }

    res.status(200).json(counterparties);
  } catch (error) {
    console.error("🔥 Error fetching counterparties:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Retrieve a single Counterparty by ID
export const getCounterpartyByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const counterparty = await getCounterpartyById(id);
    if (!counterparty) {
      console.log(`⚠️ Counterparty ${id} not found.`);
      return res.status(404).json({ error: "Counterparty not found" });
    }
    res.status(200).json(counterparty);
  } catch (error) {
    console.error(`❌ Error fetching counterparty ${id}:`, error.message);
    res.status(500).json({ error: "Failed to fetch counterparty" });
  }
};

// 🔹 Create a new Counterparty
export const createCounterpartyController = async (req, res) => {
  try {
    await createCounterparty(req.body);
    console.log("✅ Counterparty created successfully:", req.body.id);
    res.status(201).json({ message: "Counterparty created successfully" });
  } catch (error) {
    console.error("❌ Error creating counterparty:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Update (replace) an existing Counterparty
export const modifyCounterpartyController = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.body.id && req.body.id !== id) {
      console.warn("⚠️ Attempted to modify 'id', which is not allowed.");
      return res.status(400).json({
        error:
          "Updating 'id' is not allowed. Use DELETE to remove and POST to create a new counterparty.",
      });
    }

    // Check if the Counterparty exists before updating
    const existingCounterparty = await getCounterpartyById(id);
    if (!existingCounterparty) {
      console.log(`⚠️ Counterparty ${id} not found.`);
      return res.status(404).json({ error: "Counterparty not found" });
    }

    await updateCounterparty(id, req.body);
    console.log(`✅ Counterparty ${id} updated successfully.`);

    // Fetch the updated record
    const updatedCounterparty = await getCounterpartyById(id);
    res.status(200).json(updatedCounterparty);
  } catch (error) {
    console.error(`❌ Error updating counterparty ${id}:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Partially Update a Counterparty (PATCH)
export const patchCounterpartyController = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.id && req.body.id !== id) {
      console.warn("⚠️ Attempted to modify 'id', which is not allowed.");
      return res.status(400).json({
        error: "Updating 'id' is not allowed.",
      });
    }

    // Check if the Counterparty exists before updating
    const existingCounterparty = await getCounterpartyById(id);
    if (!existingCounterparty) {
      console.log(`⚠️ Counterparty ${id} not found.`);
      return res.status(404).json({ error: "Counterparty not found" });
    }

    await patchCounterparty(id, req.body);
    console.log(`✅ Counterparty ${id} patched successfully.`);

    // Fetch the updated record
    const updatedCounterparty = await getCounterpartyById(id);
    res.status(200).json(updatedCounterparty);
  } catch (error) {
    console.error(`❌ Error patching counterparty ${id}:`, error.message);
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Delete a Counterparty
export const deleteCounterpartyController = async (req, res) => {
  const { id } = req.params;
  try {
    const existingCounterparty = await getCounterpartyById(id);
    if (!existingCounterparty) {
      console.log(`⚠️ Counterparty ${id} not found.`);
      return res.status(404).json({ error: "Counterparty not found" });
    }

    await deleteCounterparty(id);
    console.log(`✅ Counterparty ${id} deleted successfully.`);
    res.status(204).send();
  } catch (error) {
    console.error(`❌ Error deleting counterparty ${id}:`, error.message);
    res.status(500).json({ error: "Failed to delete counterparty" });
  }
};
