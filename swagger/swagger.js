export default {
  openapi: "3.0.1",
  info: {
    title: "FX Trader API",
    version: "1.0.0",
    description: "Comprehensive documentation for the FX Trader backend API.",
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
            description: "A list of counterparties.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Counterparty" },
                },
              },
            },
          },
          400: {
            description: "Invalid Counterparty request body or parameters.",
          },
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while fetching counterparties.",
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
            description: "Counterparty created successfully.",
          },
          400: {
            description: "Invalid Counterparty request body or parameters.",
          },
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while updating Counterparty.",
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
            description: "Counterparty ID.",
          },
        ],
        responses: {
          200: {
            description: "Details of the specified counterparty.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Counterparty" },
              },
            },
          },
          400: {
            description: "Invalid Counterparty request body or parameters.",
          },
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while updating Counterparty.",
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
            description: "Counterparty ID to update.",
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
            description: "Counterparty updated successfully.",
          },
          400: {
            description: "Invalid Counterparty request body or parameters.",
          },
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while updating Counterparty.",
          },
        },
      },
      patch: {
        summary: "Partially update an existing counterparty",
        tags: ["Counterparties"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID to partially update.",
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
            description: "Counterparty updated successfully.",
          },
          400: {
            description: "Validation error or invalid request.",
          },
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while updating the counterparty.",
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
            description: "Counterparty ID to delete.",
          },
        ],
        responses: {
          200: {
            description: "Counterparty deleted successfully.",
          },
          400: {
            description: "Invalid counterparty request parameters.",
          },
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while deleting the counterparty.",
          },
        },
      },
    },
    "/nostro-accounts": {
      get: {
        summary: "Retrieve all Nostro Accounts",
        tags: ["Nostro Accounts"],
        responses: {
          200: {
            description: "A list of Nostro Accounts.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Nostro" },
                },
              },
            },
          },
          400: {
            description: "Invalid Nostro Account request parameters.",
          },
          404: {
            description:
              "Nostro Account not found for the specified counterparty.",
          },
          500: {
            description: "Server error while fetching Nostro Account.",
          },
        },
      },
    },
    "/nostro-accounts/{nostroAccountId}": {
      get: {
        summary: "Retrieve a Nostro Account by Nostro Account ID",
        tags: ["Nostro Accounts"],
        parameters: [
          {
            name: "nostroAccountId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Unique identifier for the Nostro Account.",
          },
        ],
        responses: {
          200: {
            description: "Details of the specified Nostro Account.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Nostro",
                },
              },
            },
          },
          400: {
            description: "Invalid Nostro Account request parameters.",
          },
          404: {
            description: "Nostro Account not found for the specified ID.",
          },
          500: {
            description: "Server error while fetching the Nostro Account.",
          },
        },
      },
      put: {
        summary: "Update a Nostro Account by Nostro Account ID",
        tags: ["Nostro Accounts"],
        parameters: [
          {
            name: "nostroAccountId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Unique identifier for the Nostro Account.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Nostro",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Nostro Account updated successfully.",
          },
          400: {
            description: "Invalid Nostro Account request parameters.",
          },
          404: {
            description: "Nostro Account not found for the specified ID.",
          },
          500: {
            description: "Server error while updating the Nostro Account.",
          },
        },
      },
      patch: {
        summary: "Partially Update a Nostro Account by Nostro Account ID",
        tags: ["Nostro Accounts"],
        parameters: [
          {
            name: "nostroAccountId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Unique identifier for the Nostro Account.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Nostro",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Nostro Account partially updated successfully.",
          },
          400: {
            description: "Invalid Nostro Account request parameters.",
          },
          404: {
            description: "Nostro Account not found for the specified ID.",
          },
          500: {
            description:
              "Server error while partially updating the Nostro Account.",
          },
        },
      },
      delete: {
        summary: "Delete a Nostro Account by ID",
        tags: ["Nostro Accounts"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Full Nostro Account ID (e.g., '002-CHF').",
          },
        ],
        responses: {
          200: {
            description: "Nostro Account deleted successfully.",
          },
          400: {
            description: "Invalid Nostro Account request parameters.",
          },
          404: {
            description: "Nostro Account not found.",
          },
          500: {
            description: "Server error while updating Nostro Account.",
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
            description: "A list of all trades.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Trade" },
                },
              },
            },
          },
          400: { description: "Invalid request parameters." },
          500: { description: "Server error while fetching trades." },
        },
      },
      post: {
        summary: "Add a new trade (SPOT, FWD, or SWAP)",
        tags: ["Trades"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Trade" },
              examples: {
                spotTrade: {
                  summary: "SPOT trade example",
                  value: {
                    tradeId: "SPOT-002-001",
                    tradeDate: "2025-01-01",
                    tradeType: "SPOT",
                    weBuyWeSell: "we buy",
                    counterpartyId: "002",
                    settlementDate: "2025-01-02",
                    buyCurrency: "GBP",
                    sellCurrency: "USD",
                    buyAmount: 1000000,
                    sellAmount: 1262000,
                    exchangeRate: 1.262,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Trade created successfully." },
          400: { description: "Trade validation error." },
          500: { description: "Server error while creating the trade." },
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
            description: "Trade ID.",
          },
        ],
        responses: {
          200: {
            description: "Details of the specified trade.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Trade" },
              },
            },
          },
          404: { description: "Trade not found." },
          500: { description: "Server error while fetching the trade." },
        },
      },
      patch: {
        summary: "Partially update a trade (excluding the key)",
        tags: ["Trades"],
        parameters: [
          {
            name: "tradeId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Trade ID to partially update.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Trade" },
              examples: {
                partialUpdateSpot: {
                  summary: "Partial update for a SPOT trade",
                  value: {
                    exchangeRate: 1.265,
                    buyAmount: 1200000,
                    sellAmount: 1518000,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Trade updated successfully." },
          400: { description: "Trade validation error." },
          404: { description: "Trade not found." },
          500: { description: "Server error while updating the trade." },
        },
      },
      put: {
        summary: "Replace a trade",
        tags: ["Trades"],
        parameters: [
          {
            name: "tradeId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Trade ID to replace.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Trade" },
              examples: {
                replaceTradeExample: {
                  summary: "Replace a trade with new details",
                  value: {
                    tradeId: "TRADE001",
                    tradeType: "SPOT",
                    tradeDate: "2025-01-19",
                    settlementDate: "2025-01-22",
                    weBuyWeSell: "we buy",
                    counterpartyId: "CPTY001",
                    buyCurrency: "USD",
                    sellCurrency: "EUR",
                    buyAmount: 1000,
                    sellAmount: 900,
                    exchangeRate: 0.9,
                    buyNostroAccountId: "BNK123",
                    sellNostroAccountId: "BNK456",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Trade replaced successfully." },
          400: { description: "Trade validation error." },
          404: { description: "Trade not found." },
          500: { description: "Server error while replacing the trade." },
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
            description: "Trade ID to delete.",
          },
        ],
        responses: {
          200: { description: "Trade deleted successfully." },
          404: { description: "Trade not found." },
          500: { description: "Server error while deleting the trade." },
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
          city: { type: "string", example: "London" },
          country: { type: "string", example: "UK" },
          currency: { type: "string", example: "GBP" },
          accountNumber: { type: "string", example: "12345678" },
          swiftCode: { type: "string", example: "GB123456" },
          contactPerson: { type: "string", example: "John Doe" },
          phone: { type: "string", example: "+441234567890" },
          email: { type: "string", example: "contact@globaltrading.com" },
        },
        required: ["id", "name", "currency"],
      },

      Nostro: {
        type: "object",
        properties: {
          id: { type: "string", example: "001-EUR" },
          counterpartyId: { type: "string", example: "001" },
          currency: { type: "string", example: "EUR" },
          nostroAccountId: { type: "string", example: "016" },
          nostroDescription: {
            type: "string",
            example: "016 - EUR Nostro Account managed by Barclays Bank",
          },
          managedById: { type: "string", example: "016" },
        },
        required: ["id", "counterpartyId", "currency", "managedById"],
      },

      Trade: {
        type: "object",
        properties: {
          tradeId: { type: "string", example: "TRADE001" },
          tradeType: {
            type: "string",
            enum: ["SPOT", "FORWARD", "SWAP"],
            example: "SPOT",
          },
          tradeDate: { type: "string", format: "date", example: "2025-01-19" },
          settlementDate: {
            type: "string",
            format: "date",
            example: "2025-01-22",
          },
          weBuyWeSell: {
            type: "string",
            enum: ["we buy", "we sell"],
            example: "we buy",
          },
          counterpartyId: { type: "string", example: "CPTY001" },
          buyCurrency: { type: "string", example: "USD" },
          sellCurrency: { type: "string", example: "EUR" },
          buyAmount: { type: "number", example: 1000 },
          sellAmount: { type: "number", example: 900 },
          exchangeRate: { type: "number", example: 0.9 },
          buyNostroAccountId: { type: "string", example: "BNK123" },
          sellNostroAccountId: { type: "string", example: "BNK456" },
        },
        required: [
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
        ],
      },

      TradePatch: {
        type: "object",
        properties: {
          tradeType: {
            type: "string",
            enum: ["SPOT", "FORWARD", "SWAP"],
            example: "FORWARD",
          },
          settlementDate: {
            type: "string",
            format: "date",
            example: "2025-01-25",
          },
          weBuyWeSell: {
            type: "string",
            enum: ["we buy", "we sell"],
            example: "we sell",
          },
          buyCurrency: { type: "string", example: "USD" },
          sellCurrency: { type: "string", example: "EUR" },
          buyAmount: { type: "number", example: 2000 },
          sellAmount: { type: "number", example: 1800 },
          exchangeRate: { type: "number", example: 0.9 },
        },
      },
    },
  },
};
