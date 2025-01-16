import request from "supertest";
import app from "../../app.js";
import { describe, it, expect } from "@jest/globals";

describe("Counterparty Controller API Tests", () => {
  it("should fetch all counterparties", async () => {
    const response = await request(app).get("/api/counterparties");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should fetch a specific counterparty by ID", async () => {
    const response = await request(app).get("/api/counterparties/008");
    if (response.status === 404) {
      expect(response.body.error).toBe("Counterparty not found");
    } else {
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: "008",
        name: "Goldman Sachs",
        city: "New York",
        country: "United States",
        currency: "USD",
        accountNumber: "56781234",
        swiftCode: "GSCMUS33",
        contactPerson: "Sophia Turner",
        email: "sophia.turner@goldmansachs.com",
        phone: "+1 212 902 1000",
      });
    }
  });

  it("should add a new counterparty", async () => {
    const newCounterparty = {
      id: "54321",
      name: "Test Counterparty",
      city: "Test City",
      country: "Test Country",
      currency: "USD",
      accountNumber: "12345678",
      swiftCode: "TESTUS33",
      contactPerson: "John Doe",
      email: "test@example.com",
      phone: "123-456-7890",
    };

    const response = await request(app)
      .post("/api/counterparties")
      .send(newCounterparty);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Counterparty created successfully");
  });

  it("should not add a duplicate counterparty", async () => {
    const duplicateCounterparty = {
      id: "54321",
      name: "Duplicate Counterparty",
      city: "Duplicate City",
      country: "Duplicate Country",
      currency: "USD",
      accountNumber: "87654321",
      swiftCode: "DUPLIC33",
      contactPerson: "Jane Doe",
      email: "duplicate@example.com",
      phone: "987-654-3210",
    };

    const response = await request(app)
      .post("/api/counterparties")
      .send(duplicateCounterparty);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Counterparty with this ID already exists."
    );
  });
});
