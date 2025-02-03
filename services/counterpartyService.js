import db from "../database/db.js";

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

export const getCounterpartyById = (counterpartyId) => {
  const query = "SELECT * FROM counterparties WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [counterpartyId], (err, row) => {
      if (err) {
        console.error(
          `Error fetching counterparty with ID ${counterpartyId}:`,
          err.message
        );
        reject(new Error("Failed to fetch counterparty"));
      } else {
        resolve(row || null);
      }
    });
  });
};

export const addCounterparty = (counterparty) => {
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

export const patchCounterparty = (counterpartyId, updates) => {
  // Check if 'id' is included in the update payload
  if (updates.id && updates.id !== counterpartyId) {
    return Promise.reject(
      new Error(
        "Updating 'id' is not allowed. Use DELETE to remove and POST to create a new counterparty."
      )
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
    db.run(query, [...values, counterpartyId], (err) => {
      if (err) {
        console.error("Error patching counterparty:", err.message);
        reject(new Error("Failed to patch counterparty"));
      } else {
        resolve();
      }
    });
  });
};

export const updateCounterparty = (counterpartyId, counterparty) => {
  // Throw an error if 'id' is part of the update payload
  if (counterparty.id && counterparty.id !== counterpartyId) {
    return Promise.reject(
      new Error(
        "Updating 'id' is not allowed. Use DELETE to remove and POST to create a new counterparty."
      )
    );
  }

  const query = `
    UPDATE counterparties
    SET name = ?, city = ?, country = ?, currency = ?, accountNumber = ?,
        swiftCode = ?, contactPerson = ?, email = ?, phone = ?
    WHERE id = ?;
  `;
  const params = [
    counterparty.name,
    counterparty.city,
    counterparty.country,
    counterparty.currency,
    counterparty.accountNumber,
    counterparty.swiftCode,
    counterparty.contactPerson,
    counterparty.email,
    counterparty.phone,
    counterpartyId,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        console.error("Error updating counterparty:", err.message);
        reject(new Error("Failed to update counterparty"));
      } else {
        resolve();
      }
    });
  });
};

export const deleteCounterparty = (counterpartyId) => {
  return new Promise((resolve, reject) => {
    // First, check if the counterparty exists
    db.get(
      "SELECT * FROM counterparties WHERE id = ?",
      [counterpartyId],
      (err, row) => {
        if (err) {
          console.error("Error checking counterparty existence:", err.message);
          return reject(new Error("Failed to check counterparty existence"));
        }

        if (!row) {
          console.log(`Counterparty with ID ${counterpartyId} not found.`);
          return reject(new Error("Counterparty not found"));
        }

        // Proceed with deletion
        db.run(
          "DELETE FROM counterparties WHERE id = ?",
          [counterpartyId],
          (delErr) => {
            if (delErr) {
              console.error("Error deleting counterparty:", delErr.message);
              return reject(new Error("Failed to delete counterparty"));
            }
            resolve();
          }
        );
      }
    );
  });
};
