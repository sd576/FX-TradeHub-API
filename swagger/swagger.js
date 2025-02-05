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
            description: "Server error while updating Counterparty.",
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
    "/nostro-accounts/{counterpartyId}": {
      get: {
        summary: "Retrieve Nostro Accounts by Counterparty ID",
        tags: ["Nostro Accounts"],
        parameters: [
          {
            name: "counterpartyId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID.",
          },
        ],
        responses: {
          200: {
            description:
              "List of Nostro Accounts for the specified counterparty.",
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
            description: "Server error while fetching Nostro Accouns.",
          },
        },
      },
    },
    "/nostro-accounts/{counterpartyId}/{currency}": {
      put: {
        summary: "Update a Nostro Account by Counterparty and Currency",
        tags: ["Nostro Accounts"],
        parameters: [
          {
            name: "counterpartyId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID.",
          },
          {
            name: "currency",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Currency code.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Nostro" },
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
            description:
              "Nostro Account not found for the specified counterparty.",
          },
          500: {
            description: "Server error while fetching Nostro Account.",
          },
        },
      },
      patch: {
        summary:
          "Partially Update a Nostro Account by Counterparty and Currency",
        tags: ["Nostro Accounts"],
        parameters: [
          {
            name: "counterpartyId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Counterparty ID.",
          },
          {
            name: "currency",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Currency code.",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Nostro" },
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
            description: "Nostro Account not found.",
          },
          500: {
            description: "Server error while updating the Nostro Account.",
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
            description: "A list of trades.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Trade" },
                },
              },
            },
          },
          400: {
            description: "Invalid Trade request parameters.",
          },
          404: {
            description: "Trade not found.",
          },
          500: {
            description: "Server error while updating Trade.",
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
            description: "Trade created successfully.",
          },
          400: {
            description: "Trade Validation error.",
          },
          404: {
            description: "Trade not found.",
          },
          500: {
            description: "Server error while creating the trade.",
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
          400: {
            description: "Trade Validation error.",
          },
          404: {
            description: "Trade not found.",
          },
          500: {
            description: "Server error while fetching the trade.",
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
            description: "Trade ID.",
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
            description: "Trade updated successfully.",
          },
          400: {
            description: "Trade Validation error.",
          },
          404: {
            description: "Trade not found.",
          },
          500: {
            description: "Server error while updating the trade.",
          },
        },
      },
      patch: {
        summary: "Partially update a trade",
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
            },
          },
        },
        responses: {
          200: {
            description: "Trade updated successfully.",
          },
          400: {
            description: "Trade Validation error.",
          },
          404: {
            description: "Trade not found.",
          },
          500: {
            description: "Server error while updating the trade.",
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
            description: "Trade ID.",
          },
        ],
        responses: {
          200: {
            description: "Trade deleted successfully.",
          },
          400: {
            description: "Trade Validation error.",
          },
          404: {
            description: "Trade not found.",
          },
          500: {
            description: "Server error while deleting the trade.",
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
          city: { type: "string", example: "London" },
          country: { type: "string", example: "UK" },
          currency: { type: "string", example: "GBP" },
          accountNumber: { type: "string", example: "12345678" },
          swiftCode: { type: "string", example: "GB123456" },
          contactPerson: { type: "string", example: "John Doe" },
          phone: { type: "string", example: "+441234567890" },
          email: { type: "string", example: "contact@globaltrading.com" },
        },
      },
      Nostro: {
        type: "object",
        properties: {
          id: { type: "string", example: "SET001" },
          counterpartyId: { type: "string", example: "CPTY001" },
          currency: { type: "string", example: "USD" },
          nostroAccountId: { type: "string", example: "NOSTRO123" },
          nostroDescription: { type: "string", example: "Main USD Account" },
          managedById: { type: "string", example: "CPTY003" },
          managedByName: { type: "string", example: "John Manager" },
        },
      },
      Trade: {
        type: "object",
        properties: {
          tradeId: { type: "string", example: "TRADE001" },
          tradeType: { type: "string", example: "spot" },
          tradeDate: { type: "string", format: "date", example: "2025-01-19" },
          settlementDate: {
            type: "string",
            format: "date",
            example: "2025-01-22",
          },
          weBuyWeSell: { type: "string", example: "Buy" },
          counterpartyId: { type: "string", example: "CPTY001" },
          buyCurrency: { type: "string", example: "USD" },
          sellCurrency: { type: "string", example: "EUR" },
          buyAmount: { type: "number", format: "float", example: 1000.0 },
          sellAmount: { type: "number", format: "float", example: 900.0 },
          exchangeRate: { type: "number", format: "float", example: 0.9 },
          buyNostroAccountId: { type: "string", example: "BNK123" },
          sellNostroAccountId: { type: "string", example: "BNK456" },
        },
      },
      TradePatch: {
        type: "object",
        properties: {
          tradeType: { type: "string", example: "forward" },
          settlementDate: {
            type: "string",
            format: "date",
            example: "2025-01-25",
          },
          weBuyWeSell: { type: "string", example: "Sell" },
          buyCurrency: { type: "string", example: "USD" },
          sellCurrency: { type: "string", example: "EUR" },
          buyAmount: { type: "number", format: "float", example: 2000.0 },
          sellAmount: { type: "number", format: "float", example: 1800.0 },
          exchangeRate: { type: "number", format: "float", example: 0.9 },
        },
      },
    },
  },
};
