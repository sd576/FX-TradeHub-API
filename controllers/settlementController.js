import db from "../database/db.js";

/**
 * Fetch all settlements from the database
 */
export const fetchAllSettlements = (req, res) => {
  const query = `
    SELECT * FROM settlements_view;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch settlements" });
    } else {
      res.json(rows);
    }
  });
};

/**
 * Fetch settlements for a specific counterparty
 */
export const fetchSettlementByCounterparty = (req, res) => {
  const { counterpartyId } = req.params;

  const query = `
    SELECT
      ni.currency AS "Currency",
      ni.nostroAccountId AS "Nostro Account ID",
      na.description AS "Nostro Account Description",
      c.id AS "Counterparty ID",
      c.name AS "Counterparty Name",
      c.city AS "City",
      c.country AS "Country"
    FROM
      nostroInstructions ni
    JOIN
      nostroAccounts na
    ON
      ni.nostroAccountId = na.id
    JOIN
      counterparties c
    ON
      ni.counterpartyId = c.id
    WHERE
      c.id = ?;
  `;

  db.all(query, [counterpartyId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch settlements" });
    } else if (rows.length === 0) {
      res
        .status(404)
        .json({ error: "No settlements found for this counterparty" });
    } else {
      const result = {
        "Counterparty ID": rows[0]["Counterparty ID"],
        "Counterparty Name": rows[0]["Counterparty Name"],
        City: rows[0]["City"],
        Country: rows[0]["Country"],
        nostroAccounts: rows.map((row) => ({
          currency: row["Currency"],
          nostroAccountId: row["Nostro Account ID"],
          nostroAccountDescription: row["Nostro Account Description"],
        })),
      };
      res.json(result);
    }
  });
};

/**
 * Fetch settlement details for a specific counterparty and currency
 */
export const fetchSettlementByCounterpartyAndCurrency = (req, res) => {
  const { counterpartyId, currency } = req.params;

  const query = `
    SELECT
      ni.currency AS "Currency",
      ni.nostroAccountId AS "Nostro Account ID",
      na.description AS "Nostro Account Description",
      c.id AS "Counterparty ID",
      c.name AS "Counterparty Name",
      c.city AS "City",
      c.country AS "Country"
    FROM
      nostroInstructions ni
    JOIN
      nostroAccounts na
    ON
      ni.nostroAccountId = na.id
    JOIN
      counterparties c
    ON
      ni.counterpartyId = c.id
    WHERE
      c.id = ? AND ni.currency = ?;
  `;

  db.get(query, [counterpartyId, currency], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch settlement details" });
    } else if (!row) {
      res.status(404).json({
        error: "No settlement found for this counterparty and currency",
      });
    } else {
      res.json(row);
    }
  });
};

/**
 * Update settlement details for a specific counterparty and currency
 */
export const updateSettlement = (req, res) => {
  const { counterpartyId, currency } = req.params;
  const { nostroAccountId, nostroAccountDescription } = req.body;

  const updateQuery = `
    UPDATE nostroInstructions
    SET nostroAccountId = ?, nostroAccountDescription = ?
    WHERE counterpartyId = ? AND currency = ?;
  `;

  db.run(
    updateQuery,
    [nostroAccountId, nostroAccountDescription, counterpartyId, currency],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Failed to update settlement" });
      } else if (this.changes === 0) {
        res.status(404).json({ error: "Settlement not found" });
      } else {
        res.json({ message: "Settlement updated successfully" });
      }
    }
  );
};

/**
 * Partially update settlement details
 */
export const partialUpdateSettlement = (req, res) => {
  const { counterpartyId, currency } = req.params;
  const updates = req.body;

  const updateKeys = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const updateQuery = `
    UPDATE nostroInstructions
    SET ${updateKeys}
    WHERE counterpartyId = ? AND currency = ?;
  `;

  db.run(
    updateQuery,
    [...Object.values(updates), counterpartyId, currency],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Failed to update settlement" });
      } else if (this.changes === 0) {
        res.status(404).json({ error: "Settlement not found" });
      } else {
        res.json({ message: "Settlement partially updated successfully" });
      }
    }
  );
};

/**
 * Delete settlement details for a specific counterparty and currency
 */
export const deleteSettlement = (req, res) => {
  const { counterpartyId, currency } = req.params;

  const deleteQuery = `
    DELETE FROM nostroInstructions
    WHERE counterpartyId = ? AND currency = ?;
  `;

  db.run(deleteQuery, [counterpartyId, currency], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to delete settlement" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Settlement not found" });
    } else {
      res.json({ message: "Settlement deleted successfully" });
    }
  });
};
