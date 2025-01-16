import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sqlite3 from "sqlite3";
import counterpartyRoutes from "./routes/counterpartyRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Determine environment and configure database
let db;
if (process.env.NODE_ENV === "test") {
  console.log("Using in-memory SQLite database for testing.");
  db = new sqlite3.Database(":memory:"); // Use in-memory database for tests
} else {
  const dbPath = "./database/fx_trades.db";
  console.log(`Connected to SQLite database at: ${dbPath}`);
  db = new sqlite3.Database(dbPath); // Production database
}

// Pass `db` instance to routes or globally attach it if needed
app.set("db", db);

// Routes
app.use("/api/counterparties", counterpartyRoutes);
app.use("/api/settlements", settlementRoutes);
app.use("/api/trades", tradeRoutes);

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server (skip during tests)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
