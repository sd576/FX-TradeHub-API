import fs from "fs";
import path from "path";

// Define source and backup folders
const sourceFolder = path.resolve("./dataSeeding");
const backupBaseFolder = path.resolve("./dataSeedingBackup");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFolder = path.join(backupBaseFolder, `backup-${timestamp}`);

// Create the backup folder if it doesn't exist
if (!fs.existsSync(sourceFolder)) {
  console.error(`Source folder not found: ${sourceFolder}`);
  process.exit(1);
}

if (!fs.existsSync(backupFolder)) {
  fs.mkdirSync(backupFolder, { recursive: true });
  console.log(`Created backup folder: ${backupFolder}`);
}

// Copy all files from dataSeeding to dataSeedingBackup
try {
  const files = fs.readdirSync(sourceFolder);

  files.forEach((file) => {
    const sourcePath = path.join(sourceFolder, file);
    const backupPath = path.join(backupFolder, file);
    fs.copyFileSync(sourcePath, backupPath);
    console.log(`Backed up: ${file} to ${backupFolder}`);
  });

  console.log("Backup completed successfully!");
} catch (error) {
  console.error("Error during backup:", error.message);
  process.exit(1);
}
