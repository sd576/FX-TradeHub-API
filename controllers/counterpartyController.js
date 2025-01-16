import {
  getAllCounterparties,
  getCounterpartyById,
  addCounterparty,
  updateCounterparty,
  deleteCounterparty,
} from "../services/counterpartyService.js";

export const fetchAllCounterparties = async (req, res) => {
  try {
    const counterparties = await getAllCounterparties();
    res.status(200).json(counterparties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchCounterpartyById = async (req, res) => {
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

export const createCounterparty = async (req, res) => {
  try {
    await addCounterparty(req.body);
    res.status(201).json({ message: "Counterparty created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const modifyCounterparty = async (req, res) => {
  const { id } = req.params;
  try {
    await updateCounterparty(id, req.body);
    res.status(200).json({ message: "Counterparty updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeCounterparty = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCounterparty(id);
    res.status(200).json({ message: "Counterparty deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
