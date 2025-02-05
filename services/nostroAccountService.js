import db from "../database/db.js";

export const getAllNostroAccounts = () => {
  const query = `
    SELECT 
      na.counterpartyId,
      c1.name AS counterpartyName,
      na.currency,
      na.nostroAccountId,
      na.nostroDescription,
      na.managedById,
      c2.name AS managedByName
    FROM nostroAccounts na
    JOIN counterparties c1 ON na.counterpartyId = c1.id
    JOIN counterparties c2 ON na.managedById = c2.id
    ORDER BY na.counterpartyId, na.currency;
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching nostro accounts:", err.message);
        reject(new Error("Failed to fetch nostro accounts"));
      } else {
        resolve(rows);
      }
    });
  });
};

// GET a single nostro account by ID
export const getNostroAccountById = (nostroAccountId) => {
  const query = `
    SELECT
      na.counterpartyId,
      c1.name AS counterpartyName,
      na.currency,
      na.nostroAccountId,
      na.nostroDescription,
      na.managedById,
      c2.name AS managedByName
    FROM nostroAccounts na
    JOIN counterparties c1 ON na.counterpartyId = c1.id
    JOIN counterparties c2 ON na.managedById = c2.id
    WHERE na.nostroAccountId = ?;
    `;
  return new Promise((resolve, reject) => {
    db.get(query, [nostroAccountId], (err, row) => {
      if (err) {
        console.error("Error fetching nostro account:", err.message);
        reject(new Error("Failed to fetch nostro account"));
      } else {
        resolve(row);
      }
    });
  });
};

// Create a new nostro account (POST)
export const createNostroAccount = (nostroAccountData) => {
  const {
    counterpartyId,
    currency,
    nostroAccountId,
    nostroDescription,
    managedById,
  } = nostroAccountData;
  const query = `
    INSERT INTO nostroAccounts (id, counterpartyId, currency, nostroAccountId, nostroAccountId, nostroDescription, managedById)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
  return new Promise((resolve, reject) => {
    db.run(
      query,
      [
        `${counterpartyId}-${currency}`,
        counterpartyId,
        currency,
        nostroAccountId,
        nostroDescription,
        managedById,
      ],
      function (err) {
        if (err) reject(new Error("Failed to create nostro account"));
        else
          resolve({
            nostroAccountId,
            message: "Nostro account created successfully",
          });
      }
    );
  });
};

// Update a nostro account (PUT - Full Update)
export const updateNostroAccount = (nostroAccountId, updatedData) => {
  const { counterpartyId, currency, nostroDescription, managedById } =
    updatedData;
  const query = `
    UPDATE nostroAccounts
    SET counterpartyId = ?, currency = ?, nostroDescription = ?, managedById = ?
    WHERE nostroAccountId = ?;
    `;
  return new Promise((resolve, reject) => {
    db.run(
      query,
      [
        counterpartyId,
        currency,
        nostroDescription,
        managedById,
        nostroAccountId,
      ],
      function (err) {
        if (err) reject(new Error("Failed to update nostro account"));
        else if (this.changes === 0)
          reject(new Error("Nostro account not found"));
        else
          resolve({
            nostroAccountId,
            message: "Nostro account updated successfully",
          });
      }
    );
  });
};

// Partial update (PATCH)
export const patchNostroAccount = (nostroAccountId, patchData) => {
  const fields = Object.keys(patchData);
  const values = Object.values(patchData);

  if (fields.length === 0)
    return Promise.reject(new Error("No fields provided for update"));

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const query = `UPDATE nostroAccounts SET ${setClause} WHERE nostroAccountId = ?;`;

  return new Promise((resolve, reject) => {
    db.run(query, [...values, nostroAccountId], function (err) {
      if (err) reject(new Error("Failed to patch nostro account"));
      else if (this.changes === 0)
        reject(new Error("Nostro account not found"));
      else
        resolve({
          nostroAccountId,
          message: "Nostro account patched successfully",
        });
    });
  });
};

// Delete a nostro account
export const deleteNostroAccount = (nostroAccountId) => {
  const query = `DELETE FROM nostroAccounts WHERE nostroAccountId = ?`;
  return new Promise((resolve, reject) => {
    db.run(query, [nostroAccountId], function (err) {
      if (err) reject(new Error("Failed to delete nostro account"));
      else if (this.changes === 0)
        reject(new Error("Nostro account not found"));
      else
        resolve({
          nostroAccountId,
          message: "Nostro account deleted successfully",
        });
    });
  });
};
