import db from "../database/db.js";

export const getAllSettlements = () => {
  const query = "SELECT * FROM settlements";
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(new Error("Failed to fetch settlements"));
      } else {
        resolve(rows);
      }
    });
  });
};

export const getSettlementsByCounterparty = (counterpartyId) => {
  const query = "SELECT * FROM settlements WHERE counterpartyId = ?";
  return new Promise((resolve, reject) => {
    db.all(query, [counterpartyId], (err, rows) => {
      if (err) {
        reject(new Error("Failed to fetch settlements"));
      } else {
        resolve(rows);
      }
    });
  });
};

export const getSettlementByCounterpartyAndCurrency = (
  counterpartyId,
  currency
) => {
  const query =
    "SELECT * FROM settlements WHERE counterpartyId = ? AND currency = ?";
  return new Promise((resolve, reject) => {
    db.get(query, [counterpartyId, currency], (err, row) => {
      if (err) {
        reject(new Error("Failed to fetch settlement"));
      } else {
        resolve(row || null);
      }
    });
  });
};

export const replaceSettlement = (settlement, counterpartyId, currency) => {
  const query = `
    INSERT INTO settlements (id, counterpartyId, currency, nostroAccountId, nostroDescription, managedById)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      nostroAccountId = excluded.nostroAccountId,
      nostroDescription = excluded.nostroDescription,
      managedById = excluded.managedById;
  `;
  const params = [
    settlement.id,
    counterpartyId,
    currency,
    settlement.nostroAccountId,
    settlement.nostroDescription,
    settlement.managedById,
  ];

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(new Error("Failed to update settlement"));
      } else {
        resolve();
      }
    });
  });
};

export const deleteSettlement = (counterpartyId, currency) => {
  const query =
    "DELETE FROM settlements WHERE counterpartyId = ? AND currency = ?";
  return new Promise((resolve, reject) => {
    db.run(query, [counterpartyId, currency], function (err) {
      if (err) {
        reject(new Error("Failed to delete settlement"));
      } else if (this.changes === 0) {
        reject(new Error("Settlement not found"));
      } else {
        resolve();
      }
    });
  });
};
