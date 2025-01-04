# Utils

This folder contains utility scripts that support various operations for the FX Trader project.

## Files and Their Functions

1. **adjustInvalidDates.js**  
   Ensures valid dates in trade data files by adjusting invalid values (e.g., days exceeding the month's limit).

2. **backupDataSeeding.js**  
   Creates a backup of the `dataSeeding` folder, storing it in the `dataSeedingBackup` directory.

3. **tradeGenerator.js**  
   Dynamically generates trade data files for testing and database population.

4. **updateDataSeedingWithPrompt.js**  
   Interactively updates data seeding files to align with the latest configurations or requirements.

---

## Running the Utilities

You can run these utilities using the commands below. These commands are preconfigured in the project's `package.json` file for convenience.

### Commands

- **Adjust Dates**:
  ```bash
  npm run adjust:dates
  npm run backup:data
  npm run generate:trades
  npm run update:data  
  ```