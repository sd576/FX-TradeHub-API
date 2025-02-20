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
        resolve(this.lastID);
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
        console.log(`✅ Query Success! Fetched ${rows.length} trades`);

        // ✅ Format dates before returning
        rows.forEach((row) => {
          row.tradeDate = formatDate(row.tradeDate);
          row.settlementDate = formatDate(row.settlementDate);
        });

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
  console.log(`🔍 Running Query: ${query} | Params: ${tradeId}`);

  return new Promise((resolve, reject) => {
    db.get(query, [tradeId], (err, row) => {
      if (err) {
        console.error(`❌ Error fetching trade ${tradeId}:`, err.message);
        reject(new Error("Failed to fetch trade by ID"));
      } else {
        if (row) {
          row.tradeDate = formatDate(row.tradeDate);
          row.settlementDate = formatDate(row.settlementDate);
          console.log(`✅ Trade Found: ${JSON.stringify(row)}`);
        } else {
          console.log(`⚠️ No trade found for ID '${tradeId}'`);
        }
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
    whereClause += " AND t.buyCurrency = ?";
    params.push(buyCurrency);
  }
  if (sellCurrency) {
    whereClause += " AND t.sellCurrency = ?";
    params.push(sellCurrency);
  }
  if (exchangeRate) {
    whereClause += " AND t.exchangeRate = ?";
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
    console.log(`🚀 Inserting Trade: ${trade.tradeId}`);

    // 🔎 Check if the trade already exists
    const existingTrade = await getTradeById(trade.tradeId);
    if (existingTrade) {
      console.log(`⚠️ Trade '${trade.tradeId}' already exists. Skipping.`);
      throw new Error(`Trade with ID '${trade.tradeId}' already exists.`);
    }

    // ✅ SQL Query to insert trade
    const query = `
      INSERT INTO trades (
        tradeId, tradeType, parentTradeId, tradeDate, settlementDate, weBuyWeSell,
        counterpartyId, buyCurrency, sellCurrency, buyAmount, sellAmount, exchangeRate,
        buyNostroAccountId, sellNostroAccountId, buyNostroDescription, sellNostroDescription
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    // ✅ Insert Near Leg (Original Trade)
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

    await executeQuery(query, nearParams);
    console.log(`✅ Near Leg Created: ${trade.tradeId}`);

    // 🚀 If this is a SWAP trade, create the FAR leg **only once**
    if (trade.tradeType === "SWAP" && !trade.tradeId.includes("-FAR")) {
      const farLegTradeId = `${trade.tradeId}-FAR`;

      // ✅ Check if the far leg already exists before inserting
      const existingFarLeg = await getTradeById(farLegTradeId);
      if (!existingFarLeg) {
        console.log(`🚀 Generating Far Leg for ${farLegTradeId}`);

        // ✅ Generate the Far Leg using the function
        const farLegTrade = generateFarLegTrade(trade);
        farLegTrade.tradeId = farLegTradeId; // ✅ Ensure the correct ID
        farLegTrade.parentTradeId = trade.tradeId; // ✅ Link to the Near Leg

        console.log("🛠 FAR Leg Trade Data:", farLegTrade);

        // ✅ Insert the Far Leg into the database
        await executeQuery(query, [
          farLegTrade.tradeId,
          farLegTrade.tradeType,
          farLegTrade.parentTradeId,
          formatDate(farLegTrade.tradeDate),
          formatDate(farLegTrade.settlementDate),
          farLegTrade.weBuyWeSell,
          farLegTrade.counterpartyId,
          farLegTrade.buyCurrency,
          farLegTrade.sellCurrency,
          farLegTrade.buyAmount,
          farLegTrade.sellAmount,
          farLegTrade.exchangeRate,
          farLegTrade.buyNostroAccountId,
          farLegTrade.sellNostroAccountId,
          farLegTrade.buyNostroDescription || "Unknown",
          farLegTrade.sellNostroDescription || "Unknown",
        ]);

        console.log(`✅ Far Leg Created: ${farLegTradeId}`);
      } else {
        console.log(`⚠️ Far Leg ${farLegTradeId} already exists. Skipping.`);
      }
    }

    return; // Ensure function exits correctly
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

// ✅ PUT: Fully Update a Trade (Handles SWAP Near & Far Legs)
export const updateTrade = async (tradeId, updates) => {
  try {
    console.log(`🚀 Updating Trade: ${tradeId}`);

    // 🔎 Ensure trade exists
    const existingTrade = await getTradeById(tradeId);
    if (!existingTrade) {
      throw new Error(`No trade found with ID '${tradeId}'`);
    }

    // 🚨 Prevent modification of immutable fields
    if (updates.tradeId && updates.tradeId !== tradeId) {
      throw new Error("Trade ID cannot be modified.");
    }

    // 🚨 Prevent modifying trade type for existing trades
    if (updates.tradeType && updates.tradeType !== existingTrade.tradeType) {
      throw new Error("Trade type cannot be modified.");
    }

    // ✅ Allowed fields for update
    const allowedFields = [
      "parentTradeId",
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

    // ✅ Filter allowed updates
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error("No valid fields to update.");
    }

    // ✅ Format dates if present
    if (filteredUpdates.tradeDate) {
      filteredUpdates.tradeDate = formatDate(filteredUpdates.tradeDate);
    }
    if (filteredUpdates.settlementDate) {
      filteredUpdates.settlementDate = formatDate(
        filteredUpdates.settlementDate
      );
    }

    // ✅ Prepare SQL query dynamically
    const fields = Object.keys(filteredUpdates);
    const values = Object.values(filteredUpdates);

    const query = `
      UPDATE trades
      SET ${fields.map((field) => `${field} = ?`).join(", ")}
      WHERE tradeId = ?;
    `;

    await new Promise((resolve, reject) => {
      db.run(query, [...values, tradeId], function (err) {
        if (err) {
          console.error(`❌ Error updating trade '${tradeId}':`, err.message);
          reject(new Error("Failed to update trade"));
        } else if (this.changes === 0) {
          reject(new Error("No trade found to update"));
        } else {
          console.log(`✅ Successfully updated trade '${tradeId}'`);
          resolve();
        }
      });
    });

    // 🔹 If it's a SWAP trade, update the far leg as well
    if (existingTrade.tradeType === "SWAP") {
      const farLegTradeId = `${tradeId}-FAR`;

      // ✅ Ensure the far leg exists
      const farLegExists = await getTradeById(farLegTradeId);
      if (farLegExists) {
        const farLegTrade = generateFarLegTrade({
          ...existingTrade,
          ...updates,
        });
        await updateTrade(farLegTradeId, farLegTrade);
      } else {
        console.warn(`⚠️ No far leg found for '${tradeId}', skipping update.`);
      }
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
