# FX Trader API Server

## Overview
The FX Trader API Server is a robust application designed to manage trades and counterparties within an FX trading environment. It serves as a comprehensive tool for testing and development, with a fully populated database that mimics realistic trading scenarios. The primary goal of this project is to provide a solid foundation for writing Postman, Cypress, and Playwright API tests.

## Current Development Notice
⚠️ **Important:** This project is actively undergoing modifications to enhance functionality and streamline workflows. Specifically:
- Routes and API endpoints are in the process of being updated and optimized.
- Node.js commands in the `package.json` file are being reviewed and may change.

As a result, certain features or commands may be in flux. Please check back frequently or refer to the latest commit messages for updates.

## Features
- **Three main tables:** `trades`, `counterparties` and `settlements`, storing detailed trade, counterparty and settlement information.
- **Pre-seeded database:** Realistic volume of data for meaningful testing.
- **Fully documented API:** Accessible via Swagger on the local development server.
- **Utility tools:** For resetting and reseeding the database.

## Purpose
This project bridges the gap between simplistic "toy" datasets and fully-fledged production systems. By including a significant amount of realistic data and providing tools to interact with it, the FX Trader API Server is ideal for:
- **API Testing:** Using tools like Postman, Cypress, and Playwright.
- **Automation Practice:** Developing robust test suites with realistic scenarios.
- **Learning and Experimentation:** Serving as a sandbox for API and database exploration.

## Getting Started
### Clone the Repository:
In your terminal, run the command:
```bash
git clone https://github.com/sd576/FX-TradeHub-API.git
```
### Navigate to the Project Directory:
```bash
cd FX-TradeHub-API
```
### Install Dependencies:
```bash
npm install
```
### Start the Server:
```bash
npm start
```
By default, the server will run on http://localhost:3000. </br> You can access the Swagger API documentation at http://localhost:3000/api-docs.

### Folder Structure

```tree

fx_trader_server/
|
├── .vscode/
|   |
│   ├── .eslint.json          # Configuration file for defining ESLint rules and code style
│   ├── launch.json           # Configuration for debugging settings in Visual Studio Code
│   ├── settings.json         # User and workspace settings for Visual Studio Code
│   ├── tasks.json            # Task definitions for automated workflows in Visual Studio Code
|   |
├── controllers/
│   ├── counterpartyController.js  # Handles HTTP requests and responses for counterparty operations
│   ├── settlementController.js    # Manages settlement-related HTTP requests and responses
│   ├── tradeController.js         # Handles trade-related HTTP requests and responses
|   |
├── database/
│   ├── db.js                  # Database connection script
│   ├── initDB.js              # Script to initialize and seed the database
|   ├── fx_trades.db           # SQLite database file storing trade and counterparty data
|   |
├── dataSeeding/
│   ├── counterpartyData.js    # Static source of truth for counterparties
│   ├── nostroData.js          # Static counterparty nostro account information
│   ├── outrightTradeData.js   # Static trade data for outright trades
│   ├── spotTradeData.js       # Static trade data for spot trades
│   ├── swapTradeData.js       # Static trade data for swaps
|   |
├── middleware/
|   ├── validate.js            # Middleware for validating incoming requests and enforcing data integrity
|   |
├── node_modules/              # Node.js dependencies (gitignored)
|   |
├── routes/
│   ├── counterpartyRoutes.js  # Routes for handling counterparty-related requests
|   ├── settlementRoutes.js    # Routes for handling settlement-related requests
│   ├── tradeRoutes.js         # Routes for handling trade-related requests
|   |
├── services/
│   ├── counterpartyService.js # Service layer for managing counterparty-related business logic
│   ├── tradeService.js        # Service layer for handling trade-related business logic and operations
|   |
├── swagger/
│   ├── swagger.js             # Swagger configuration for API documentation
|   |
├── .env                       # Environment variables for sensitive configuration
├── .gitignore                 # Git ignore file for untracked files/folders
├── app.js                     # Main Express server entry point
├── eslint.config.js           # ESLint rules for consistent code style
├── LICENSE                    # Project licensing terms and conditions
├── package-lock.json          # Dependency lock file
├── package.json               # Node.js project metadata and scripts
├── README.md                  # Project overview and utility instructions

```


## Commands

### Resetting and Reseeding the Database

Run the following commands in sequence to reset the database, generate new trade data, and seed the database with fresh data:

Open SQLite database for direct queries:
```bash
npm run db
```

Start the API server:
```bash
npm start
```
Seed the database and start the server:
```bash
npm run setup-and-start
```

Work with SQLite Database directly:
```bash
npm run sqlite
```

Run the server in Development Mode:
```bash
npm run dev
```



- The server will run at http://localhost:3000.


### Accessing Swagger Documentation

The API documentation is available at: http://localhost:3000/api-docs

Here, you can:

- Explore available API endpoints.
- Test API functionality with example requests and responses.
- View the schemas for trades and counterparties.

## Available API Endpoints

### Counterparties
- GET /api/counterparties: Retrieve all counterparties.
- GET /api/counterparties/{id}: Retrieve a specific counterparty by ID.
- POST /api/counterparties: Add a new counterparty.

### Trades
- GET /api/trades: Retrieve all trades.
- GET /api/trades/{id}: Retrieve all trades, optionally filtered by 'we buy' or 'we sell'
- POST /api/trades: Add a new trade. - under development

## Testing and Development

This project is ideal for:

1. Writing Postman collections for endpoint testing.
2. Practicing Cypress API test automation.
3. Creating robust Playwright test suites for end-to-end API validation.

## Contributing

Contributions are welcome! If you’d like to add features, improve the database schema, or extend the documentation, feel free to fork this repository and create a pull request.

## License

This project is licensed under the MIT License.