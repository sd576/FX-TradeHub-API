import db from "../database/db.js";
import { format } from "date-fns";
import { buildTradeQuery } from "../utils/buildTradeQuery.js";
import { generateFarLegTrade } from "../utils/generateFarLegTrade.js";

// ✅ Utility function to execute SQL queries
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        console.error("❌ Error executing query:", err.message);
        reject(err);
      } else {
        resolve(this.lastID); // ✅ Resolve with last inserted row ID
      }
    });
  });
};

// ✅ Format dates to 'YYYY-MM-DD' for insertion
const formatDate = (date) => {
  if (!date) return null;
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : format(parsedDate, "yyyy-MM-dd");
};

// ✅ GET all trades
export const getAllTrades = () => {
  const query = buildTradeQuery();
  console.log("Executing SQL Query:\n", query);

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("❌ Error fetching trades:", err.message);
        reject(new Error("Failed to fetch trades"));
      } else {
        console.log(`✅ Query Success! Fetched ${rows.length}`);
        resolve(rows);
      }
    });
  });
};

// ✅ Get trades for a specific counterparty
export const getTradesByCounterparty = (counterpartyId) => {
  const query = buildTradeQuery("WHERE counterpartyId = ?");
  return new Promise((resolve, reject) => {
    db.all(query, [counterpartyId], (err, rows) => {
      if (err) {
        console.error(
          `Error fetching trades for counterparty ${counterpartyId}:`,
          err.message
        );
        reject(new Error("Failed to fetch trades by counterparty"));
      } else {
        resolve(rows);
      }
    });
  });
};

// ✅ Fetch trades by date range.
export const getTradesByDateRange = (startDate, endDate) => {
  const query = buildTradeQuery("WHERE tradeDate BETWEEN ? AND ?");
  return new Promise((resolve, reject) => {
    db.all(query, [startDate, endDate], (err, rows) => {
      if (err) {
        console.error("Error fetching trades by date range:", err.message);
        reject(new Error("Failed to fetch trades by date range"));
      } else {
        resolve(rows);
      }
    });
  });
};

// ✅ GET a single trade
export const getTradeById = (tradeId) => {
  const query = buildTradeQuery("WHERE t.tradeId = ?");
  return new Promise((resolve, reject) => {
    db.get(query, [tradeId], (err, row) => {
      if (err) {
        console.error(`Error fetching trade ${tradeId}:`, err.message);
        reject(new Error("Failed to fetch trade by ID"));
      } else {
        resolve(row || null);
      }
    });
  });
};

// ✅ GET Trades by flexible criteria
export const getTradesByCriteria = (criteria) => {
  const { buyCurrency, sellCurrency, exchangeRate } = criteria;
  let whereClause = "WHERE 1=1";
  const params = [];

  if (buyCurrency) {
    query += " AND t.buyCurrency = ?";
    params.push(buyCurrency);
  }
  if (sellCurrency) {
    query += " AND t.sellCurrency = ?";
    params.push(sellCurrency);
  }
  if (exchangeRate) {
    query += " AND t.exchangeRate = ?";
    params.push(exchangeRate);
  }

  const query = buildTradeQuery(whereClause);

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error("Error fetching trades by criteria:", err.message);
        reject(new Error("Failed to fetch trades by criteria"));
      } else {
        resolve(rows);
      }
    });
  });
};

// ✅ POST a new Trade (Handles SWAP near & far legs)
export const insertTrade = async (trade) => {
  try {
    // 🔎 Check if the trade already exists
    const existingTrade = await getTradeById(trade.tradeId);
    if (existingTrade) {
      throw new Error(`Trade with ID '${trade.tradeId}' already exists.`);
    }

    // ✅ Define the SQL query for inserting trades
    const query = `
      INSERT INTO trades (
        tradeId, tradeType, parentTradeId, tradeDate, settlementDate, weBuyWeSell,
        counterpartyId, buyCurrency, sellCurrency, buyAmount, sellAmount, exchangeRate,
        buyNostroAccountId, sellNostroAccountId, buyNostroDescription, sellNostroDescription
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    // ✅ Prepare parameters for the near leg (first trade)
    const nearParams = [
      trade.tradeId,
      trade.tradeType,
      trade.parentTradeId || null,
      formatDate(trade.tradeDate),
      formatDate(trade.settlementDate),
      trade.weBuyWeSell,
      trade.counterpartyId,
      trade.buyCurrency,
      trade.sellCurrency,
      trade.buyAmount,
      trade.sellAmount,
      trade.exchangeRate,
      trade.buyNostroAccountId,
      trade.sellNostroAccountId,
      trade.buyNostroDescription || "Unknown",
      trade.sellNostroDescription || "Unknown",
    ];

    // 🔹 INSERT the Near Leg (Original Trade)
    await executeQuery(query, nearParams); // ✅ Fixed function call (removed `db` param)

    // 🚀 If it's a SWAP, generate the FAR leg
    if (trade.tradeType === "SWAP") {
      const farLegTrade = generateFarLegTrade(trade);
      await insertTrade(farLegTrade); // ✅ Recursively insert the far leg
    }

    return;
  } catch (error) {
    console.error("❌ Error in insertTrade:", error.message);
    throw error;
  }
};

// ✅ PATCH a Trade
export const patchTrade = async (tradeId, updates) => {
  try {
    // Ensure the trade exists
    const existingTrade = await getTradeById(tradeId);
    if (!existingTrade) {
      throw new Error(`No trade found with ID '${tradeId}'`);
    }

    // 🔹 Define allowed fields for PATCH updates
    const allowedFields = [
      "tradeDate",
      "settlementDate",
      "weBuyWeSell",
      "counterpartyId",
      "buyCurrency",
      "sellCurrency",
      "buyAmount",
      "sellAmount",
      "exchangeRate",
      "buyNostroAccountId",
      "sellNostroAccountId",
    ];

    // 🔹 Filter out invalid fields
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error("No valid fields to update");
    }

    // 🔹 Format dates if present in updates
    if (filteredUpdates.tradeDate) {
      filteredUpdates.tradeDate = formatDate(filteredUpdates.tradeDate);
    }
    if (filteredUpdates.settlementDate) {
      filteredUpdates.settlementDate = formatDate(
        filteredUpdates.settlementDate
      );
    }

    const fields = Object.keys(filteredUpdates);
    const values = Object.values(filteredUpdates);

    const query = `
      UPDATE trades
      SET ${fields.map((field) => `${field} = ?`).join(", ")}
      WHERE tradeId = ?;
    `;

    return new Promise((resolve, reject) => {
      db.run(query, [...values, tradeId], function (err) {
        if (err) {
          console.error(`❌ Error patching trade '${tradeId}':`, err.message);
          reject(new Error("Failed to patch trade"));
        } else if (this.changes === 0) {
          reject(new Error("No trade found to patch"));
        } else {
          console.log(`✅ Successfully patched trade '${tradeId}'`);
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("❌ Error in patchTrade:", error.message);
    throw error;
  }
};

// ✅ PUT a trade
export const updateTrade = async (tradeId, updates) => {
  try {
    // Ensure the trade exists
    const existingTrade = await getTradeById(tradeId);
    if (!existingTrade) {
      throw new Error(`No trade found with ID '${tradeId}'`);
    }

    // ✅ Prepare SQL Query for updating trades
    const query = `
      UPDATE trades
      SET tradeType = ?, parentTradeId = ?, tradeDate = ?, settlementDate = ?,
          weBuyWeSell = ?, counterpartyId = ?, buyCurrency = ?, sellCurrency = ?,
          buyAmount = ?, sellAmount = ?, exchangeRate = ?, buyNostroAccountId = ?, sellNostroAccountId = ?,
          buyNostroDescription = ?, sellNostroDescription = ?
      WHERE tradeId = ?;
    `;

    // ✅ Prepare parameters for the update
    const params = [
      updates.tradeType || existingTrade.tradeType, // ✅ Ensures tradeType is never null
      updates.parentTradeId || existingTrade.parentTradeId,
      formatDate(updates.tradeDate || existingTrade.tradeDate),
      formatDate(updates.settlementDate || existingTrade.settlementDate),
      updates.weBuyWeSell || existingTrade.weBuyWeSell,
      updates.counterpartyId || existingTrade.counterpartyId,
      updates.buyCurrency || existingTrade.buyCurrency,
      updates.sellCurrency || existingTrade.sellCurrency,
      updates.buyAmount || existingTrade.buyAmount,
      updates.sellAmount || existingTrade.sellAmount,
      updates.exchangeRate || existingTrade.exchangeRate,
      updates.buyNostroAccountId || existingTrade.buyNostroAccountId,
      updates.sellNostroAccountId || existingTrade.sellNostroAccountId,
      updates.buyNostroDescription ||
        existingTrade.buyNostroDescription ||
        "Unknown",
      updates.sellNostroDescription ||
        existingTrade.sellNostroDescription ||
        "Unknown",
      tradeId,
    ];

    // ✅ Execute the update
    await new Promise((resolve, reject) => {
      db.run(query, params, (err) => {
        if (err) {
          console.error(`❌ Error updating trade '${tradeId}':`, err.message);
          reject(new Error("Failed to update trade"));
        } else {
          resolve();
        }
      });
    });

    console.log(`✅ Successfully updated trade '${tradeId}'`);

    // 🔹 If it's a SWAP trade, update the far leg as well
    if (existingTrade.tradeType === "SWAP") {
      const farLegTradeId = `${tradeId}-FAR`;

      // ✅ Ensure the far leg retains tradeType and required fields
      const farLegTrade = generateFarLegTrade({ ...existingTrade, ...updates });

      await updateTrade(farLegTradeId, farLegTrade);
    }

    return;
  } catch (error) {
    console.error("❌ Error in updateTrade:", error.message);
    throw error;
  }
};

// ✅ DELETE trade by ID
export const deleteTradeById = async (tradeId) => {
  try {
    // ✅ Ensure trade exists before attempting deletion
    const existingTrade = await getTradeById(tradeId);
    if (!existingTrade) {
      throw new Error(`No trade found with ID '${tradeId}'`);
    }

    // ✅ DELETE Main trade
    await executeQuery(`DELETE FROM trades WHERE tradeId = ?`, [tradeId]);
    console.log(`✅ Successfully deleted trade '${tradeId}'`);

    // 🔹 If it's a SWAP trade, delete the far leg (ONLY ONCE)
    if (existingTrade.tradeType === "SWAP") {
      const farLegTradeId = `${tradeId}-FAR`;
      const farLegExists = await getTradeById(farLegTradeId);
      if (farLegExists) {
        await executeQuery(`DELETE FROM trades WHERE tradeId = ?`, [
          farLegTradeId,
        ]);
        console.log(`✅ Successfully deleted trade '${farLegTradeId}'`);
      }
    }
  } catch (error) {
    console.error(`❌ Error deleting trade ${tradeId}:`, error.message);
    throw error;
  }
};
