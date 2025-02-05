import db from "../database/db.js";

// ✅ Get all Nostro Accounts
export const getAllNostroAccounts = () => {
  const query = "SELECT * FROM nostroAccounts";
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching nostroAccounts:", err.message);
        reject(new Error("Failed to fetch nostroAccounts"));
      } else {
        resolve(rows);
      }
    });
  });
};

// ✅ Get a single Nostro Account by ID
export const getNostroAccountById = (id) => {
  const query = "SELECT * FROM nostroAccounts WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error(
          `Error fetching nostroAccount with ID ${id}:`,
          err.message
        );
        reject(new Error("Failed to fetch nostroAccount"));
      } else {
        resolve(row || null);
      }
    });
  });
};

// ✅ Create a new Nostro Account
export const createNostroAccount = (nostroAccount) => {
  const query = `
    INSERT INTO nostroAccounts (id, counterpartyId, currency, nostroAccountId, nostroDescription, managedById)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const params = [
    nostroAccount.id,
    nostroAccount.counterpartyId,
    nostroAccount.currency,
    nostroAccount.nostroAccountId,
    nostroAccount.nostroDescription,
    nostroAccount.managedById,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        console.error("Error adding nostroAccount:", err.message);
        reject(
          err.code === "SQLITE_CONSTRAINT"
            ? new Error("Nostro Account with this ID already exists.")
            : new Error("Failed to add nostroAccount")
        );
      } else {
        resolve();
      }
    });
  });
};

// ✅ Patch (Partial Update) a Nostro Account
export const patchNostroAccount = (id, updates) => {
  if (updates.id && updates.id !== id) {
    return Promise.reject(
      new Error(
        "Updating 'id' is not allowed. Use DELETE and POST to create a new Nostro Account."
      )
    );
  }

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const query = `
    UPDATE nostroAccounts
    SET ${fields.map((field) => `${field} = ?`).join(", ")}
    WHERE id = ?;
  `;

  return new Promise((resolve, reject) => {
    db.run(query, [...values, id], (err) => {
      if (err) {
        console.error("Error patching nostroAccount:", err.message);
        reject(new Error("Failed to patch nostroAccount"));
      } else {
        resolve();
      }
    });
  });
};

// ✅ Update (PUT) a Nostro Account
export const updateNostroAccount = (id, nostroAccount) => {
  if (nostroAccount.id && nostroAccount.id !== id) {
    return Promise.reject(
      new Error(
        "Updating 'id' is not allowed. Use DELETE and POST to create a new Nostro Account."
      )
    );
  }

  const query = `
    UPDATE nostroAccounts
    SET counterpartyId = ?, currency = ?, nostroAccountId = ?, nostroDescription = ?, managedById = ?
    WHERE id = ?;
  `;
  const params = [
    nostroAccount.counterpartyId,
    nostroAccount.currency,
    nostroAccount.nostroAccountId,
    nostroAccount.nostroDescription,
    nostroAccount.managedById,
    id,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        console.error("Error updating nostroAccount:", err.message);
        reject(new Error("Failed to update nostroAccount"));
      } else {
        resolve();
      }
    });
  });
};

// ✅ Delete a Nostro Account
export const deleteNostroAccount = (id) => {
  return new Promise((resolve, reject) => {
    // Check if the nostro account exists
    db.get("SELECT * FROM nostroAccounts WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error("Error checking nostroAccount existence:", err.message);
        return reject(new Error("Failed to check nostroAccount existence"));
      }

      if (!row) {
        console.log(`Nostro Account with ID ${id} not found.`);
        return reject(new Error("Nostro Account not found"));
      }

      // Proceed with deletion
      db.run("DELETE FROM nostroAccounts WHERE id = ?", [id], (delErr) => {
        if (delErr) {
          console.error("Error deleting nostroAccount:", delErr.message);
          return reject(new Error("Failed to delete nostroAccount"));
        }
        resolve();
      });
    });
  });
};
