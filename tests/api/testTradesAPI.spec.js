import supertest from "supertest"; // HTTP request library
import app from "../app.js"; // Your Express app instance
import db from "../database/db.js"; // Database connection for teardown
import { describe, it, expect, afterAll } from "@jest/globals"; // Jest functions

describe("Trade API Tests", () => {
  const testTradeId = "TEST-001";

  // Test retrieving all trades
  it("should fetch all trades", async () => {
    const response = await supertest(app).get("/api/trades");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test fetching a trade by ID
  it("should fetch a trade by ID", async () => {
    const tradeId = "SWAP-006-005"; // Replace with a valid tradeId
    const response = await supertest(app).get(`/api/trades/${tradeId}`);
    if (response.status === 404) {
      expect(response.body.error).toBe("Trade not found");
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        tradeId,
        tradeType: expect.any(String),
        tradeDate: expect.any(String),
        settlementDate: expect.any(String),
        weBuyWeSell: expect.any(String),
        counterpartyId: expect.any(String),
        buyCurrency: expect.any(String),
        sellCurrency: expect.any(String),
        buyAmount: expect.any(Number),
        sellAmount: expect.any(Number),
        exchangeRate: expect.any(Number),
        buyNostroAccountId: expect.any(String),
        sellNostroAccountId: expect.any(String),
      });
    }
  });

  // Test creating a new trade
  it("should create a new trade", async () => {
    const newTrade = {
      tradeId: testTradeId,
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
    expect(response.body.message).toBe("Trade created successfully");
  });

  // Test fetching a non-existent trade
  it("should return 404 for a non-existent trade ID", async () => {
    const response = await supertest(app).get("/api/trades/INVALID-ID");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Trade not found");
  });

  afterAll(async () => {
    // Cleanup test data
    await db.run("DELETE FROM trades WHERE tradeId = ?", [testTradeId]);
  });
});
