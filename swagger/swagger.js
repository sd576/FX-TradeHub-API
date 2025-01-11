import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "FX Trader API",
      version: "1.0.0",
      description:
        "API for managing trades and counterparties in the FX Trader system",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
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
        name: "Nostro Accounts",
        description: "Operations related to nostro accounts",
      },
      {
        name: "Nostro Instructions",
        description: "Operations related to nostro instructions",
      },
    ],
    components: {
      schemas: {
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
        NostroAccount: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique ID of the nostro account",
              example: "001EUR",
            },
            counterpartyId: {
              type: "string",
              description:
                "ID of the counterparty associated with the nostro account",
              example: "001",
            },
            currency: {
              type: "string",
              description: "Currency of the nostro account",
              example: "EUR",
            },
            description: {
              type: "string",
              description: "Description of the nostro account",
              example: "Barclays Bank - EUR",
            },
          },
          required: ["id", "counterpartyId", "currency"],
        },
        NostroInstruction: {
          type: "object",
          properties: {
            counterpartyId: {
              type: "string",
              description: "ID of the counterparty",
              example: "001",
            },
            currency: {
              type: "string",
              description: "Currency for the nostro instruction",
              example: "EUR",
            },
            nostroAccountId: {
              type: "string",
              description: "ID of the associated nostro account",
              example: "001EUR",
            },
            nostroAccountDescription: {
              type: "string",
              description:
                "Description of the nostro account handling this currency",
              example: "Barclays Bank handles EUR",
            },
          },
          required: ["counterpartyId", "currency", "nostroAccountId"],
        },
      },
    },
  },
  apis: ["./routes/**/*.js"], // Adjust path if routes are in a different location
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
