import db from "../database/db.js";

// ✅ Get all Counterparties
export const getAllCounterparties = () => {
  const query = "SELECT * FROM counterparties";
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching counterparties:", err.message);
        reject(new Error("Failed to fetch counterparties"));
      } else {
        resolve(rows);
      }
    });
  });
};

// ✅ Get a single Counterparty by ID
export const getCounterpartyById = (id) => {
  // ✅ Changed counterpartyId → id
  const query = "SELECT * FROM counterparties WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error(
          `Error fetching counterparty with ID ${id}:`,
          err.message
        );
        reject(new Error("Failed to fetch counterparty"));
      } else {
        resolve(row || null);
      }
    });
  });
};

// ✅ Create a new Counterparty (Renamed from addCounterparty)
export const createCounterparty = (counterparty) => {
  const query = `
    INSERT INTO counterparties (
      id, name, city, country, currency, accountNumber, swiftCode, contactPerson, email, phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const params = [
    counterparty.id,
    counterparty.name,
    counterparty.city,
    counterparty.country,
    counterparty.currency,
    counterparty.accountNumber,
    counterparty.swiftCode,
    counterparty.contactPerson,
    counterparty.email,
    counterparty.phone,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        console.error("Error adding counterparty:", err.message);
        reject(
          err.code === "SQLITE_CONSTRAINT"
            ? new Error("Counterparty with this ID already exists.")
            : new Error("Failed to add counterparty")
        );
      } else {
        resolve();
      }
    });
  });
};

// ✅ Patch (Partial Update) a Counterparty
export const patchCounterparty = (id, updates) => {
  // ✅ Changed counterpartyId → id
  if (updates.id && updates.id !== id) {
    return Promise.reject(
      new Error("Updating 'id' is not allowed. Use DELETE and POST instead.")
    );
  }

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const query = `
    UPDATE counterparties
    SET ${fields.map((field) => `${field} = ?`).join(", ")}
    WHERE id = ?;
  `;

  return new Promise((resolve, reject) => {
    db.run(query, [...values, id], (err) => {
      if (err) {
        console.error("Error patching counterparty:", err.message);
        reject(new Error("Failed to patch counterparty"));
      } else {
        resolve();
      }
    });
  });
};

// ✅ Update (PUT) a Counterparty
export const updateCounterparty = async (counterpartyId, counterparty) => {
  console.log(`[🔍 UPDATE] Updating Counterparty ID: ${counterpartyId}`);
  console.log(`[🧐 DATA] Incoming Data:`, counterparty);

  if (counterparty.id && counterparty.id !== counterpartyId) {
    throw new Error(
      "Updating 'id' is not allowed. Use DELETE to remove and POST to create a new counterparty."
    );
  }

  // Step 1: Fetch existing counterparty to merge missing fields
  const existingCounterparty = await getCounterpartyById(counterpartyId);
  if (!existingCounterparty) {
    throw new Error("Counterparty not found");
  }

  // Step 2: Merge existing data with incoming updates
  const updatedData = {
    ...existingCounterparty, // Preserve existing values
    ...counterparty, // Overwrite with new values
  };

  // Ensure required fields are not missing
  if (!updatedData.name || !updatedData.currency) {
    throw new Error("Name and currency are required fields.");
  }

  const query = `
    UPDATE counterparties
    SET name = ?, city = ?, country = ?, currency = ?, accountNumber = ?,
        swiftCode = ?, contactPerson = ?, email = ?, phone = ?
    WHERE id = ?;
  `;

  const params = [
    updatedData.name,
    updatedData.city,
    updatedData.country,
    updatedData.currency,
    updatedData.accountNumber,
    updatedData.swiftCode,
    updatedData.contactPerson,
    updatedData.email,
    updatedData.phone,
    counterpartyId,
  ];

  console.log(`[🚀 QUERY]`, query);
  console.log(`[🚀 PARAMS]`, params);

  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        console.error("[❌ ERROR] Failed to update counterparty:", err.message);
        return reject(new Error("Failed to update counterparty"));
      } else if (this.changes === 0) {
        console.error("[⚠️ WARNING] No changes detected.");
        return reject(new Error("Counterparty not updated"));
      } else {
        console.log("[✅ SUCCESS] Counterparty updated.");
        resolve();
      }
    });
  });
};

// ✅ Delete a Counterparty
export const deleteCounterparty = (id) => {
  // ✅ Changed counterpartyId → id
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM counterparties WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("Error checking counterparty existence:", err.message);
        return reject(new Error("Failed to check counterparty existence"));
      }

      if (!row) {
        return reject(new Error("Counterparty not found"));
      }

      db.run("DELETE FROM counterparties WHERE id = ?", [id], (delErr) => {
        if (delErr) {
          console.error("Error deleting counterparty:", delErr.message);
          return reject(new Error("Failed to delete counterparty"));
        }
        resolve();
      });
    });
  });
};
