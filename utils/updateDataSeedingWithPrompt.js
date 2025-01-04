import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import readline from "readline";
import path from "path";

const generatedFolder =
  "/Volumes/Stuarts Documents/fx_trader/fx_trader_server/generatedTradeOutput";
const dataSeedingFolder =
  "/Volumes/Stuarts Documents/fx_trader/fx_trader_server/dataSeeding";

const filesToUpdate = [
  { jsonFile: "spotTradeData.json", jsFile: "spotTradeData.js" },
  { jsonFile: "outrightTradeData.json", jsFile: "outrightTradeData.js" },
  { jsonFile: "swapTradeData.json", jsFile: "swapTradeData.js" },
];

// Outdated files to remove
const outdatedFiles = ["swapNearTradeData.js", "swapFarTradeData.js"];

// Confirmation prompt
const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askConfirmation = (message) =>
  new Promise((resolve) => {
    prompt.question(`${message} (yes/no): `, (answer) => {
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });

(async () => {
  try {
    // Ask for confirmation
    const confirm = await askConfirmation(
      "Do you want to overwrite the data in the dataSeeding folder with the latest files from generatedTradeOutput?"
    );

    if (!confirm) {
      console.log("Operation canceled. No files were overwritten.");
      prompt.close();
      return;
    }

    // Process files
    filesToUpdate.forEach(({ jsonFile, jsFile }) => {
      const jsonFilePath = path.join(generatedFolder, jsonFile);
      const jsFilePath = path.join(dataSeedingFolder, jsFile);

      if (existsSync(jsonFilePath)) {
        const jsonData = readFileSync(jsonFilePath, "utf-8");
        const formattedJsData = `
import fs from "fs";
import path from "path";

// Initially empty placeholder
let ${jsFile.replace(".js", "")} = [];

// Fields for validation
const ${jsFile.replace(".js", "")}Fields = [
  "tradeId",
  "tradeDate",
  "tradeType",
  "counterpartyId",
  "settlementDate",
  "buyCurrency",
  "sellCurrency",
  "buyAmount",
  "sellAmount",
  "exchangeRate",
  "buyNostroAccount",
  "sellNostroAccount",
];

// Hardcoded initial data
const initial${jsFile.replace(".js", "")} = ${jsonData};

// Overwrite function
const overwriteData = () => {
  ${jsFile.replace(".js", "")} = initial${jsFile.replace(".js", "")};
  console.log("Data has been overwritten with the default records.");

  // Save as JSON file
  const filePath = path.resolve("./${jsonFile}");
  fs.writeFileSync(filePath, JSON.stringify(${jsFile.replace(
    ".js",
    ""
  )}, null, 2), "utf-8");
  console.log(\`Updated data saved to '\${filePath}'.\`);
};

// Execute overwrite function
overwriteData();

export { ${jsFile.replace(".js", "")}, ${jsFile.replace(".js", "")}Fields };
`;

        writeFileSync(jsFilePath, formattedJsData, "utf-8");
        console.log(`Updated: ${jsFile}`);
      } else {
        console.warn(`JSON file not found: ${jsonFile}`);
      }
    });

    // Remove outdated files
    outdatedFiles.forEach((file) => {
      const filePath = path.join(dataSeedingFolder, file);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        console.log(`Removed outdated file: ${file}`);
      }
    });

    console.log("Data seeding files updated successfully!");
  } catch (error) {
    console.error("Error during update:", error.message);
  } finally {
    prompt.close();
  }
})();
