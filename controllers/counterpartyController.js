import {
  getAllCounterparties,
  getCounterpartySettlements,
  addCounterparty,
} from "../services/counterpartyService.js";

export const fetchCounterparties = async (req, res) => {
  try {
    const counterparties = await getAllCounterparties();
    res.json(counterparties);
  } catch (err) {
    console.error("Error fetching counterparties:", err); // Log the error
    res.status(500).json({ error: "Failed to fetch counterparties" });
  }
};

export const fetchSettlements = async (req, res) => {
  const { counterpartyId } = req.params;
  try {
    const settlements = await getCounterpartySettlements(counterpartyId);
    if (settlements.length === 0) {
      res.status(404).json({ error: "No settlements found" });
    } else {
      const result = {
        "Counterparty ID": settlements[0]["Counterparty ID"],
        "Counterparty Name": settlements[0]["Counterparty Name"],
        City: settlements[0]["City"],
        Country: settlements[0]["Country"],
        nostroAccounts: settlements.map((row) => ({
          currency: row.currency,
          nostroAccountId: row.nostroAccountId,
          description: row.description,
        })),
      };
      res.json(result);
    }
  } catch (err) {
    console.error(
      `Error fetching settlements for counterparty ID ${counterpartyId}:`,
      err
    ); // Log the error
    res.status(500).json({ error: "Failed to fetch settlements" });
  }
};

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
