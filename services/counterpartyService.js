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

export const updateCounterparty = (counterpartyId, counterparty) => {
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
  const query = "DELETE FROM counterparties WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(query, [counterpartyId], (err) => {
      if (err) {
        console.error("Error deleting counterparty:", err.message);
        reject(new Error("Failed to delete counterparty"));
      } else {
        resolve();
      }
    });
  });
};
