import {
  getAllSettlements,
  getSettlementByCounterpartyAndCurrency,
  replaceSettlement,
  deleteSettlement,
} from "../../services/settlementService.js";
import db from "../../database/db.js";

const testSettlements = async () => {
  try {
    // Seed the database if the record doesn't exist
    const recordExists = await db.get(
      "SELECT * FROM settlements WHERE id = ?",
      ["SETTLEMENT-001"]
    );
    if (!recordExists) {
      console.log("Seeding database with initial settlement record:");
      await db.run(`
          INSERT INTO settlements (id, counterpartyId, currency, nostroAccountId, nostroDescription, managedById)
          VALUES ('SETTLEMENT-001', 'COUNTERPARTY-001', 'USD', 'NOSTRO-001', 'Description', 'MANAGER-001');
        `);
    } else {
      console.log("Record already exists, skipping seed.");
    }

    console.log("Fetching all settlements:");
    console.log(await getAllSettlements());

    console.log("Replacing settlement with ID 'SETTLEMENT-001':");
    console.log(
      await replaceSettlement(
        {
          id: "SETTLEMENT-001", // Ensure the `id` matches the primary key
          nostroAccountId: "NOSTRO-002",
          nostroDescription: "Updated Description",
          managedById: "MANAGER-002",
        },
        "COUNTERPARTY-001", // Counterparty ID
        "USD" // Currency
      )
    );

    console.log("Fetching settlement after replacement:");
    console.log(
      await getSettlementByCounterpartyAndCurrency("COUNTERPARTY-001", "USD")
    );

    console.log("Deleting settlement with ID 'SETTLEMENT-001':");
    console.log(await deleteSettlement("COUNTERPARTY-001", "USD"));
  } catch (err) {
    console.error("Error testing settlements:", err.message);
  }
};

testSettlements();
