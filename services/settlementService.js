import db from "../database/db.js";

export const getAllSettlements = () => {
  const query = `
    SELECT 
      s.id AS settlementId,
      s.counterpartyId,
      c.name AS counterpartyName,
      s.currency,
      s.nostroAccountId,
      s.nostroDescription,
      s.managedById,
      m.name AS managedByName
    FROM 
      settlements s
    JOIN 
      counterparties c ON s.counterpartyId = c.id
    LEFT JOIN 
      counterparties m ON s.managedById = m.id;
  `;
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
  const query = `
    SELECT 
      s.id AS settlementId,
      s.counterpartyId,
      c.name AS counterpartyName,
      s.currency,
      s.nostroAccountId,
      s.nostroDescription,
      s.managedById,
      m.name AS managedByName
    FROM 
      settlements s
    JOIN 
      counterparties c ON s.counterpartyId = c.id
    LEFT JOIN 
      counterparties m ON s.managedById = m.id
    WHERE 
      s.counterpartyId = ?;
  `;
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
  const query = `
    SELECT 
      s.id AS settlementId,
      s.counterpartyId,
      c.name AS counterpartyName,
      s.currency,
      s.nostroAccountId,
      s.nostroDescription,
      s.managedById,
      m.name AS managedByName
    FROM 
      settlements s
    JOIN 
      counterparties c ON s.counterpartyId = c.id
    LEFT JOIN 
      counterparties m ON s.managedById = m.id
    WHERE 
      s.counterpartyId = ? AND s.currency = ?;
  `;
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

export const patchSettlement = (id, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  const query = `
    UPDATE settlements
    SET ${fields.map((field) => `${field} = ?`).join(", ")}
    WHERE id = ?;
  `;

  return new Promise((resolve, reject) => {
    db.run(query, [...values, id], (err) => {
      if (err) {
        reject(new Error("Failed to patch settlement"));
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
