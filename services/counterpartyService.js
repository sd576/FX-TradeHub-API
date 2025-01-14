import db from "../database/db.js";

/**
 * Retrieve all counterparties from the database.
 * @returns {Promise<Array>} - A promise that resolves to an array of counterparties.
 */
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

/**
 * Retrieve settlements for a specific counterparty.
 * @param {string} counterpartyId - The ID of the counterparty.
 * @returns {Promise<Array>} - A promise that resolves to an array of settlements.
 */
export const getCounterpartySettlements = (counterpartyId) => {
  const query = `
    SELECT
      ni.currency AS "currency",
      ni.nostroAccountId AS "nostroAccountId",
      na.description AS "description",
      c.id AS "Counterparty ID",
      c.name AS "Counterparty Name",
      c.city AS "City",
      c.country AS "Country"
    FROM
      nostroInstructions ni
    JOIN
      nostroAccounts na ON ni.nostroAccountId = na.id
    JOIN
      counterparties c ON ni.counterpartyId = c.id
    WHERE c.id = ?;
  `;
  return new Promise((resolve, reject) => {
    db.all(query, [counterpartyId], (err, rows) => {
      if (err) {
        console.error(
          `Error fetching settlements for counterparty ${counterpartyId}:`,
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
 * Add a new counterparty to the database.
 * @param {Object} counterparty - The counterparty details.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
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
