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

// ✅ Get all Nostro Accounts for a given counterpartyId
export const getNostrosByCpty = (counterpartyId) => {
  const query = "SELECT * FROM nostroAccounts WHERE counterpartyId = ?";
  return new Promise((resolve, reject) => {
    db.all(query, [counterpartyId], (err, rows) => {
      if (err) {
        console.error(
          `Error fetching nostroAccounts for counterpartyId ${counterpartyId}:`,
          err.message
        );
        reject(new Error("Failed to fetch nostroAccounts for counterparty"));
      } else {
        resolve(rows.length ? rows : null); // Return null if no records found
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
        return reject(
          err.code === "SQLITE_CONSTRAINT"
            ? new Error("Nostro Account with this ID already exists.")
            : new Error("Failed to add nostroAccount")
        );
      }

      console.log("Successfully added Nostro Account: ", nostroAccount);
      resolve(nostroAccount);
    });
  });
};

// ✅ Patch (Partial Update) a Nostro Account
export const patchNostroAccount = (id, updates) => {
  return new Promise((resolve, reject) => {
    console.log("[🔍 PATCH] Received updates:", updates);

    const allowedFields = [
      "counterpartyId",
      "currency",
      "nostroAccountId",
      "nostroDescription",
      "managedById",
    ];

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    console.log("[🧐 PATCH] Fields in request:", fields);
    console.log("[🧐 PATCH] Values in request:", values);

    const filteredFields = fields.filter((field) =>
      allowedFields.includes(field)
    );
    const filteredValues = filteredFields.map((field) => updates[field]); // Ensure values match fields

    console.log("[🛠️ PATCH] Allowed fields for update:", filteredFields);
    console.log("[🛠️ PATCH] Filtered values:", filteredValues);

    if (filteredFields.length === 0) {
      console.log("[❌ PATCH ERROR] No valid fields provided for update.");
      return reject(new Error("No valid fields to update."));
    }

    const query = `
      UPDATE nostroAccounts
      SET ${filteredFields.map((field) => `${field} = ?`).join(", ")}
      WHERE id = ?;
    `;

    console.log("[🚀 PATCH QUERY]:", query);
    console.log("[🚀 PATCH PARAMS]:", [...filteredValues, id]);

    db.run(query, [...filteredValues, id], function (err) {
      if (err) {
        console.error("[❌ PATCH ERROR] Database error:", err.message);
        return reject(new Error("Failed to patch nostroAccount"));
      } else if (this.changes === 0) {
        console.log("[❌ PATCH ERROR] No changes detected, record not found.");
        return reject(new Error("Nostro Account not found"));
      } else {
        console.log("[✅ PATCH SUCCESS] Nostro Account Updated");
        resolve();
      }
    });
  });
};

// ✅ Update (PUT) a Nostro Account
export const updateNostroAccount = (id, nostroAccount) => {
  return new Promise((resolve, reject) => {
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

    db.run(query, params, function (err) {
      if (err) {
        console.error("Error updating nostroAccount:", err.message);
        reject(new Error("Failed to update nostroAccount"));
      } else if (this.changes === 0) {
        reject(new Error("Nostro Account not found"));
      } else {
        resolve();
      }
    });
  });
};

// ✅ Delete a Nostro Account
export const deleteNostroAccount = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM nostroAccounts WHERE id = ?", [id], function (err) {
      if (err) {
        console.error("Error deleting nostroAccount:", err.message);
        reject(new Error("Failed to delete Nostro Account"));
      } else if (this.changes === 0) {
        reject(new Error("Nostro Account not found"));
      } else {
        resolve();
      }
    });
  });
};
