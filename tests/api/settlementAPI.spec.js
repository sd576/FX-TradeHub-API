import { expect } from "chai";
import { describe, it } from "mocha";
import request from "supertest";
import app from "../../app.js";

describe("Settlement Controller API Tests", () => {
  it("should fetch all settlements", async () => {
    const response = await request(app).get("/api/settlements");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("should fetch settlements for a specific counterparty", async () => {
    const counterpartyId = "008";
    const response = await request(app).get(
      `/api/settlements/${counterpartyId}`
    );
    if (response.status === 404) {
      expect(response.body.error).to.equal("Settlement not found");
    } else {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    }
  });

  it("should fetch a specific settlement by counterparty and currency", async () => {
    const counterpartyId = "008";
    const currency = "USD";
    const response = await request(app).get(
      `/api/settlements/${counterpartyId}/${currency}`
    );
    if (response.status === 404) {
      expect(response.body.error).to.equal("Settlement not found");
    } else {
      expect(response.status).to.equal(200);
      expect(response.body).to.include({
        counterpartyId,
        currency,
      });
      expect(response.body).to.have.keys(
        "id",
        "counterpartyId",
        "currency",
        "nostroAccountId",
        "nostroDescription",
        "managedById"
      );
    }
  });

  it("should replace a settlement for a specific counterparty and currency", async () => {
    const counterpartyId = "008";
    const currency = "USD";
    const settlement = {
      id: "SET-001",
      nostroAccountId: "NA-001",
      nostroDescription: "Updated Description",
      managedById: "MGR-001",
    };

    const response = await request(app)
      .put(`/api/settlements/${counterpartyId}/${currency}`)
      .send(settlement);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Settlement replaced successfully");
  });

  it("should delete a settlement for a specific counterparty and currency", async () => {
    const counterpartyId = "008";
    const currency = "USD";
    const response = await request(app).delete(
      `/api/settlements/${counterpartyId}/${currency}`
    );
    if (response.status === 404) {
      expect(response.body.error).to.equal("Settlement not found");
    } else {
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Settlement deleted successfully");
    }
  });
});
