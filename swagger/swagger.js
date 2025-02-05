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
            description: "Validation error or missing fields.",
          },
          500: {
            description: "Server error while creating the counterparty.",
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
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while fetching the counterparty.",
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
            description: "Validation error or attempt to change the ID.",
          },
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while updating the counterparty.",
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
          404: {
            description: "Counterparty not found.",
          },
          500: {
            description: "Server error while deleting the counterparty.",
          },
        },
      },
    },
    "/nostroAccounts": {
      get: {
        summary: "Retrieve all nostroAccounts",
        tags: ["NostroAccounts"],
        responses: {
          200: {
            description: "A list of nostroAccounts.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Nostro" },
                },
              },
            },
          },
          500: {
            description: "Server error while fetching nostroAccounts.",
          },
        },
      },
    },
    "/nostroAccounts/{counterpartyId}": {
      get: {
        summary: "Retrieve Nostro Accounts by counterparty ID",
        tags: ["NostroAccounts"],
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
          404: {
            description:
              "NostroAccounts not found for the specified counterparty.",
          },
          500: {
            description: "Server error while fetching nostroAccounts.",
          },
        },
      },
    },
    "/nostroAccounts/{counterpartyId}/{currency}": {
      put: {
        summary: "Update a Nostro Account by counterparty and currency",
        tags: ["NostroAccounts"],
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
          404: {
            description: "Nostro Accountnot found.",
          },
          500: {
            description: "Server error while updating the Nostro Account.",
          },
        },
      },
      patch: {
        summary:
          "Partially update a Nostro Account by counterparty and currency",
        tags: ["NostroAccounts"],
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
            description: "Nostro updated successfully.",
          },
          400: {
            description: "Validation error or invalid request.",
          },
          404: {
            description: "Nostro not found.",
          },
          500: {
            description: "Server error while updating the Nostro Account.",
          },
        },
      },
      delete: {
        summary: "Delete a Nostro Account by counterparty and currency",
        tags: ["NostroAccounts"],
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
        responses: {
          200: {
            description: "Nostro deleted successfully.",
          },
          404: {
            description: "Nostro not found.",
          },
          500: {
            description: "Server error while deleting the Nostro Account.",
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
          500: {
            description: "Server error while fetching trades.",
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
            description: "Validation error.",
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
            description: "Validation error or invalid request.",
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
