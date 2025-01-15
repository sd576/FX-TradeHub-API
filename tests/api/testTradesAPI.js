import supertest from "supertest"; // HTTP request library
import app from "../app.js"; // Your Express app instance
import db from "../database/db.js"; // Database connection for teardown
import { describe, it, expect, afterAll } from "@jest/globals"; // Jest functions

describe("Trade API Tests", () => {
  // Example: Test retrieving all trades
  it("should fetch all trades", async () => {
    const response = await supertest(app).get("/api/trades");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Example: Test fetching a trade by ID
  it("should fetch a trade by ID", async () => {
    const tradeId = "SWAP-006-005"; // Existing tradeId for testing
    const response = await supertest(app).get(`/api/trades/${tradeId}`);
    expect(response.status).toBe(200);
    expect(response.body.tradeId).toBe(tradeId);
  });

  // Example: Test creating a trade (if your API allows it)
  it("should create a new trade", async () => {
    const newTrade = {
      tradeId: "TEST-001",
      tradeType: "SPOT",
      tradeDate: "2025-01-25",
      settlementDate: "2025-01-26",
      weBuyWeSell: "we buy",
      counterpartyId: "006",
      buyCurrency: "USD",
      sellCurrency: "EUR",
      buyAmount: 1000000,
      sellAmount: 920000,
      exchangeRate: 0.92,
      buyNostroAccountId: "006-USD",
      sellNostroAccountId: "006-EUR",
    };

    const response = await supertest(app).post("/api/trades").send(newTrade);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Trade created successfully!");
  });

  // Example: Test fetching a non-existent trade
  it("should return 404 for a non-existent trade ID", async () => {
    const response = await supertest(app).get("/api/trades/INVALID-ID");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Trade not found");
  });

  afterAll(async () => {
    // Optional cleanup if the test created data
    await db.run("DELETE FROM trades WHERE tradeId = 'TEST-001'");
  });
});
