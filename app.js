import express from "express";
import settlementRoutes from "./routes/settlementRoutes.js";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Register routes
app.use("/api/settlements", settlementRoutes);

export default app;
