import { error } from "console";
import {
  getAllCounterparties,
  getCounterpartyById,
  addCounterparty,
  updateCounterparty,
  patchCounterparty,
  deleteCounterparty,
} from "../services/counterpartyService.js";

export const getAllCounterpartiesController = async (req, res) => {
  try {
    const counterparties = await getAllCounterparties();
    res.status(200).json(counterparties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCounterpartyByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const counterparty = await getCounterpartyById(id);
    if (!counterparty) {
      res.status(404).json({ error: "Counterparty not found" });
    } else {
      res.status(200).json(counterparty);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCounterpartyController = async (req, res) => {
  try {
    await addCounterparty(req.body);
    res.status(201).json({ message: "Counterparty created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const modifyCounterpartyController = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.id && req.body.id !== id) {
      return res.status(400).json({
        error:
          "Updating 'id' is not allowed. Use DELETE to remove and POST to create a new counterparty.",
      });
    }

    // Check if the counterparty exists before updating
    const existingCounterparty = await getCounterpartyById(id);
    if (!existingCounterparty) {
      return res.status(404).json({ error: "Counterparty not found" });
    }

    await updateCounterparty(id, req.body);

    // Fetch the updated record
    const updatedCounterparty = await getCounterpartyById(id);

    res.status(200).json(updatedCounterparty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const patchCounterpartyController = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.id && req.body.id !== id) {
      return res.status(400).json({
        error: "Updating 'id' is not allowed.",
      });
    }

    // Check if the counterparty exists before updating
    const existingCounterparty = await getCounterpartyById(id);
    if (!existingCounterparty) {
      return res.status(404).json({ error: "Counterparty not found" });
    }

    await patchCounterparty(id, req.body);

    // Fetch the updated record
    const updatedCounterparty = await getCounterpartyById(id);

    res.status(200).json(updatedCounterparty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeCounterpartyController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCounterparty(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === "Counterparty not found") {
      return res.status(404).json({ error: "Counterparty not found" });
    }
    res.status(500).json({ error: "Failed to delete counterparty" });
  }
};
