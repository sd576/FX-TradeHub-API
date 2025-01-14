import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger/swagger.js";
import counterpartyRoutes from "./routes/counterpartyRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use("/api/counterparties", counterpartyRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/settlements", settlementRoutes);

// Root endpoint for API health check
app.get("/", (req, res) => {
  res.send("FX Trader API is running!");
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Swagger documentation is available at http://localhost:${PORT}/api-docs`
  );
});
