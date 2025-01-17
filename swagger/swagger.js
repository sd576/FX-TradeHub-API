export default {
  openapi: "3.0.1",
  info: {
    title: "FX Trader API",
    version: "1.0.0",
    description: "Comprehensive documentation for the FX Trader backend API",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Development Server",
    },
  ],
  paths: {
    "/counterparties": {
      get: {
        summary: "Retrieve all counterparties",
        tags: ["Counterparties"],
        responses: {
          200: {
            description: "A list of counterparties",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Counterparty" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Add a new counterparty",
        tags: ["Counterparties"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Counterparty" },
            },
          },
        },
        responses: {
          201: {
            description: "Counterparty created successfully",
          },
          400: {
            description: "Validation error",
          },
        },
      },
    },
    "/counterparties/{id}": {
      get: {
        summary: "Retrieve a single counterparty by ID",
        tags: ["Counterparties"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID",
          },
        ],
        responses: {
          200: {
            description: "A single counterparty",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Counterparty" },
              },
            },
          },
          404: {
            description: "Counterparty not found",
          },
        },
      },
      put: {
        summary: "Update an existing counterparty",
        tags: ["Counterparties"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Counterparty" },
            },
          },
        },
        responses: {
          200: {
            description: "Counterparty updated successfully",
          },
          400: {
            description: "Validation error",
          },
          404: {
            description: "Counterparty not found",
          },
        },
      },
      delete: {
        summary: "Delete a counterparty",
        tags: ["Counterparties"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID",
          },
        ],
        responses: {
          200: {
            description: "Counterparty deleted successfully",
          },
          404: {
            description: "Counterparty not found",
          },
        },
      },
    },
    "/settlements": {
      get: {
        summary: "Retrieve all settlements",
        tags: ["Settlements"],
        responses: {
          200: {
            description: "A list of settlements",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Settlement" },
                },
              },
            },
          },
        },
      },
    },
    "/settlements/{counterpartyId}": {
      get: {
        summary: "Retrieve settlements by counterparty ID",
        tags: ["Settlements"],
        parameters: [
          {
            name: "counterpartyId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID",
          },
        ],
        responses: {
          200: {
            description: "Settlements for the counterparty",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Settlement" },
                },
              },
            },
          },
          404: {
            description: "Settlements not found for the counterparty",
          },
        },
      },
    },
    "/settlements/{counterpartyId}/{currency}": {
      put: {
        summary: "Update a settlement by counterparty and currency",
        tags: ["Settlements"],
        parameters: [
          {
            name: "counterpartyId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID",
          },
          {
            name: "currency",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Currency code",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Settlement" },
            },
          },
        },
        responses: {
          200: {
            description: "Settlement updated successfully",
          },
          404: {
            description: "Settlement not found",
          },
        },
      },
      delete: {
        summary: "Delete a settlement by counterparty and currency",
        tags: ["Settlements"],
        parameters: [
          {
            name: "counterpartyId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID",
          },
          {
            name: "currency",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Currency code",
          },
        ],
        responses: {
          200: {
            description: "Settlement deleted successfully",
          },
          404: {
            description: "Settlement not found",
          },
        },
      },
    },
    "/trades": {
      get: {
        summary: "Retrieve all trades",
        tags: ["Trades"],
        responses: {
          200: {
            description: "A list of trades",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Trade" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Add a new trade",
        tags: ["Trades"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Trade" },
            },
          },
        },
        responses: {
          201: {
            description: "Trade created successfully",
          },
          400: {
            description: "Validation error",
          },
        },
      },
    },
    "/trades/{tradeId}": {
      get: {
        summary: "Retrieve a single trade by ID",
        tags: ["Trades"],
        parameters: [
          {
            name: "tradeId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Trade ID",
          },
        ],
        responses: {
          200: {
            description: "A single trade",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Trade" },
              },
            },
          },
          404: {
            description: "Trade not found",
          },
        },
      },
      put: {
        summary: "Update a trade",
        tags: ["Trades"],
        parameters: [
          {
            name: "tradeId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Trade ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Trade" },
            },
          },
        },
        responses: {
          200: {
            description: "Trade updated successfully",
          },
          404: {
            description: "Trade not found",
          },
        },
      },
      delete: {
        summary: "Delete a trade",
        tags: ["Trades"],
        parameters: [
          {
            name: "tradeId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Trade ID",
          },
        ],
        responses: {
          200: {
            description: "Trade deleted successfully",
          },
          404: {
            description: "Trade not found",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Counterparty: {
        type: "object",
        properties: {
          id: { type: "string", example: "CPTY001" },
          name: { type: "string", example: "Global Trading Ltd" },
          email: { type: "string", example: "example@example.com" },
          city: { type: "string", example: "London" },
          country: { type: "string", example: "UK" },
          currency: { type: "string", example: "GBP" },
          accountNumber: { type: "string", example: "12345678" },
          swiftCode: { type: "string", example: "GB123456" },
          contactPerson: { type: "string", example: "John Doe" },
          phone: { type: "string", example: "+441234567890" },
        },
      },
      Settlement: {
        type: "object",
        properties: {
          id: { type: "string", example: "SET001" },
          counterpartyId: { type: "string", example: "CPTY001" },
          currency: { type: "string", example: "USD" },
          nostroAccountId: { type: "string", example: "NOSTRO123" },
          nostroDescription: { type: "string", example: "Main USD Account" },
        },
      },
      Trade: {
        type: "object",
        properties: {
          tradeId: { type: "string", example: "TRADE001" },
          tradeType: { type: "string", example: "spot" },
          tradeDate: { type: "string", example: "2025-01-16" },
          settlementDate: { type: "string", example: "2025-01-19" },
          buyCurrency: { type: "string", example: "USD" },
          sellCurrency: { type: "string", example: "EUR" },
          buyAmount: { type: "number", example: 1000.0 },
          sellAmount: { type: "number", example: 900.0 },
          exchangeRate: { type: "number", example: 0.9 },
        },
      },
    },
  },
};
