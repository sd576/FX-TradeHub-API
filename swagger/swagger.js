import swaggerJSDoc from "swagger-jsdoc";

// Define Swagger options and API documentation structure
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "FX Trader API", // API title
      version: "1.0.0", // API version
      description:
        "API for managing trades, counterparties, and settlements in the FX Trader system", // Brief description
    },
    servers: [
      {
        url: "http://localhost:3000", // Development server URL
        description: "Development server", // Server description
      },
    ],
    tags: [
      {
        name: "Counterparties",
        description: "Operations related to counterparties",
      },
      {
        name: "Trades",
        description: "Operations related to trades",
      },
      {
        name: "Settlements",
        description: "Account settlement details",
      },
    ],
    components: {
      schemas: {
        // Schema for Counterparty
        Counterparty: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the counterparty",
              example: "CPTY123",
            },
            name: {
              type: "string",
              description: "Counterparty name",
              example: "Acme Trading Co.",
            },
            city: {
              type: "string",
              description: "City where the counterparty is located",
              example: "New York",
            },
            country: {
              type: "string",
              description: "Country of the counterparty",
              example: "USA",
            },
            currency: {
              type: "string",
              description: "Default trading currency for the counterparty",
              example: "USD",
            },
          },
        },
        // Schema for Trade
        Trade: {
          type: "object",
          properties: {
            tradeId: {
              type: "string",
              description: "Unique identifier for the trade",
              example: "TRD456",
            },
            tradeType: {
              type: "string",
              description: "Type of trade (e.g., SPOT, FWD, SWAP)",
              example: "SPOT",
            },
            counterpartyId: {
              type: "string",
              description: "ID of the counterparty",
              example: "CPTY123",
            },
            tradeDate: {
              type: "string",
              format: "date",
              description: "Date of the trade",
              example: "2024-01-01",
            },
            buyCurrency: {
              type: "string",
              description: "Currency being bought",
              example: "USD",
            },
            sellCurrency: {
              type: "string",
              description: "Currency being sold",
              example: "EUR",
            },
            buyAmount: {
              type: "number",
              description: "Amount of currency being bought",
              example: 100000,
            },
            sellAmount: {
              type: "number",
              description: "Amount of currency being sold",
              example: 85000,
            },
            exchangeRate: {
              type: "number",
              description: "Exchange rate for the trade",
              example: 1.1765,
            },
          },
        },
        // Schema for Settlement
        Settlement: {
          type: "object",
          properties: {
            "Counterparty ID": {
              type: "string",
              description: "Unique identifier for the counterparty",
              example: "001",
            },
            "Counterparty Name": {
              type: "string",
              description: "Name of the counterparty",
              example: "Barclays Bank",
            },
            City: {
              type: "string",
              description: "City of the counterparty",
              example: "London",
            },
            Country: {
              type: "string",
              description: "Country of the counterparty",
              example: "United Kingdom",
            },
            Takes: {
              type: "string",
              description:
                "Which bank and country the counterparty takes the currency",
              example:
                "EUR -> 001EUR, Barclays Bank - EUR | USD -> 001USD, Barclays Bank - USD",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/**/*.js"], // Path to API route files
};

// Generate Swagger docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
