import { expect } from "chai";
import { describe, it, after } from "mocha";
import request from "supertest";
import app from "../../app.js";
import db from "../../database/db.js";

describe("Trade API Tests", () => {
  const testTradeId = "TEST-001";

  // Test retrieving all trades
  it("should fetch all trades", async () => {
    const response = await request(app).get("/api/trades");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.be.greaterThan(0);
  });

  // Test fetching a trade by ID
  it("should fetch a trade by ID", async () => {
    const tradeId = "SWAP-006-005";
    const response = await request(app).get(`/api/trades/${tradeId}`);
    if (response.status === 404) {
      expect(response.body.error).to.equal("Trade not found");
    } else {
      expect(response.status).to.equal(200);
      expect(response.body).to.include.keys(
        "tradeId",
        "tradeType",
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
        "sellNostroAccountId"
      );
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

    const response = await request(app).post("/api/trades").send(newTrade);
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal("Trade created successfully");
  });

  // Test fetching a non-existent trade
  it("should return 404 for a non-existent trade ID", async () => {
    const response = await request(app).get("/api/trades/INVALID-ID");
    expect(response.status).to.equal(404);
    expect(response.body.error).to.equal("Trade not found");
  });

  after(async () => {
    // Cleanup test data
    await db.run("DELETE FROM trades WHERE tradeId = ?", [testTradeId]);
  });
});
