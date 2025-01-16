import request from "supertest";
import app from "../../app.js";
import { describe, it, expect } from "@jest/globals";

describe("Settlement Controller API Tests", () => {
  it("should fetch all settlements", async () => {
    const response = await request(app).get("/api/settlements");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should fetch settlements for a specific counterparty", async () => {
    const counterpartyId = "008"; // Replace with valid counterparty ID
    const response = await request(app).get(
      `/api/settlements/${counterpartyId}`
    );
    if (response.status === 404) {
      expect(response.body.error).toBe("Settlement not found");
    } else {
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    }
  });

  it("should fetch a specific settlement by counterparty and currency", async () => {
    const counterpartyId = "008"; // Replace with valid counterparty ID
    const currency = "USD"; // Replace with valid currency
    const response = await request(app).get(
      `/api/settlements/${counterpartyId}/${currency}`
    );
    if (response.status === 404) {
      expect(response.body.error).toBe("Settlement not found");
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(String),
        counterpartyId,
        currency,
        nostroAccountId: expect.any(String),
        nostroDescription: expect.any(String),
        managedById: expect.any(String),
      });
    }
  });

  it("should replace a settlement for a specific counterparty and currency", async () => {
    const counterpartyId = "008"; // Replace with valid counterparty ID
    const currency = "USD"; // Replace with valid currency
    const settlement = {
      id: "SET-001",
      nostroAccountId: "NA-001",
      nostroDescription: "Updated Description",
      managedById: "MGR-001",
    };

    const response = await request(app)
      .put(`/api/settlements/${counterpartyId}/${currency}`)
      .send(settlement);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Settlement replaced successfully");
  });

  it("should delete a settlement for a specific counterparty and currency", async () => {
    const counterpartyId = "008"; // Replace with valid counterparty ID
    const currency = "USD"; // Replace with valid currency
    const response = await request(app).delete(
      `/api/settlements/${counterpartyId}/${currency}`
    );
    if (response.status === 404) {
      expect(response.body.error).toBe("Settlement not found");
    } else {
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Settlement deleted successfully");
    }
  });
});
