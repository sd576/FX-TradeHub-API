import {
  getAllCounterparties,
  getCounterpartyById,
  addCounterparty,
} from "../services/counterpartyService.js";

// Fetch all counterparties
export const fetchCounterparties = async (req, res) => {
  try {
    const counterparties = await getAllCounterparties();
    res.json(counterparties);
  } catch (err) {
    console.error("Error fetching counterparties:", err); // Log the error
    res.status(500).json({ error: "Failed to fetch counterparties" });
  }
};

// Fetch a single counterparty by ID
export const fetchCounterpartyById = async (req, res) => {
  const { counterpartyId } = req.params;
  try {
    const counterparty = await getCounterpartyById(counterpartyId);
    if (!counterparty) {
      return res
        .status(404)
        .json({ error: `Counterparty with ID ${counterpartyId} not found.` });
    }
    res.json(counterparty);
  } catch (err) {
    console.error(
      `Error fetching counterparty with ID ${counterpartyId}:`,
      err
    );
    res.status(500).json({ error: "Failed to fetch counterparty" });
  }
};

// Add a new counterparty
export const createCounterparty = async (req, res) => {
  const counterparty = req.body;
  try {
    await addCounterparty(counterparty);
    res.status(201).json({ message: "Counterparty added successfully!" });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      res
        .status(409)
        .json({ error: "Counterparty with this ID already exists." });
    } else {
      console.error("Error adding counterparty:", err); // Log the error
      res.status(500).json({ error: "Failed to add counterparty" });
    }
  }
};
