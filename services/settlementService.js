import db from "../database/db.js";

/**
 * Retrieve all settlements.
 * @returns {Promise<Array>} - A promise that resolves to an array of all settlements.
 */
export const getAllSettlements = () => {
  const query = "SELECT * FROM settlements;";
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching settlements:", err.message);
        reject(new Error("Failed to fetch settlements"));
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Retrieve settlements for a specific counterparty.
 * @param {string} counterpartyId - The counterparty ID.
 * @returns {Promise<Array>} - A promise that resolves to settlements for the given counterparty.
 */
export const getSettlementsByCounterparty = (counterpartyId) => {
  const query = "SELECT * FROM settlements WHERE counterpartyId = ?;";
  return new Promise((resolve, reject) => {
    db.all(query, [counterpartyId], (err, rows) => {
      if (err) {
        console.error(
          `Error fetching settlements for ${counterpartyId}:`,
          err.message
        );
        reject(new Error("Failed to fetch settlements"));
      } else {
        resolve(rows);
      }
    });
  });
};

/**
 * Retrieve settlement details for a specific counterparty and currency.
 * @param {string} counterpartyId - The counterparty ID.
 * @param {string} currency - The currency code.
 * @returns {Promise<Object|null>} - A promise that resolves to the settlement or null if not found.
 */
export const getSettlementByCounterpartyAndCurrency = (
  counterpartyId,
  currency
) => {
  const query =
    "SELECT * FROM settlements WHERE counterpartyId = ? AND currency = ?;";
  return new Promise((resolve, reject) => {
    db.get(query, [counterpartyId, currency], (err, row) => {
      if (err) {
        console.error(
          `Error fetching settlement for ${counterpartyId} and ${currency}:`,
          err.message
        );
        reject(new Error("Failed to fetch settlement"));
      } else {
        resolve(row || null);
      }
    });
  });
};

/**
 * Replace settlement details for a specific counterparty and currency.
 * @param {Object} settlement - The updated settlement details.
 * @param {string} counterpartyId - The counterparty ID.
 * @param {string} currency - The currency code.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
export const replaceSettlement = (settlement, counterpartyId, currency) => {
  const query = `
    UPDATE settlements
    SET nostroAccountId = ?, nostroDescription = ?, managedById = ?
    WHERE counterpartyId = ? AND currency = ?;
  `;
  const params = [
    settlement.nostroAccountId,
    settlement.nostroDescription,
    settlement.managedById,
    counterpartyId,
    currency,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        console.error(
          `Error replacing settlement for ${counterpartyId} and ${currency}:`,
          err.message
        );
        reject(new Error("Failed to replace settlement"));
      } else if (this.changes === 0) {
        reject(new Error("Settlement not found"));
      } else {
        resolve();
      }
    });
  });
};

/**
 * Partially update settlement details for a specific counterparty and currency.
 * @param {Object} updates - The updates to apply.
 * @param {string} counterpartyId - The counterparty ID.
 * @param {string} currency - The currency code.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
export const updateSettlement = (updates, counterpartyId, currency) => {
  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const query = `UPDATE settlements SET ${fields} WHERE counterpartyId = ? AND currency = ?;`;
  const params = [...Object.values(updates), counterpartyId, currency];

  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        console.error(
          `Error updating settlement for ${counterpartyId} and ${currency}:`,
          err.message
        );
        reject(new Error("Failed to update settlement"));
      } else if (this.changes === 0) {
        reject(new Error("Settlement not found"));
      } else {
        resolve();
      }
    });
  });
};

/**
 * Delete a settlement for a specific counterparty and currency.
 * @param {string} counterpartyId - The counterparty ID.
 * @param {string} currency - The currency code.
 * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
 */
export const deleteSettlement = (counterpartyId, currency) => {
  const query =
    "DELETE FROM settlements WHERE counterpartyId = ? AND currency = ?;";
  return new Promise((resolve, reject) => {
    db.run(query, [counterpartyId, currency], function (err) {
      if (err) {
        console.error(
          `Error deleting settlement for ${counterpartyId} and ${currency}:`,
          err.message
        );
        reject(new Error("Failed to delete settlement"));
      } else if (this.changes === 0) {
        reject(new Error("Settlement not found"));
      } else {
        resolve();
      }
    });
  });
};
