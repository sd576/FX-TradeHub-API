import { exec } from "child_process";

const tests = [
  "tests/services/testCounterpartyService.js",
  "tests/services/testTradeService.js",
  "tests/services/testSettlementService.js",
];

for (const test of tests) {
  exec(`node ${test}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running ${test}:\n${stderr}`);
    } else {
      console.log(`Output for ${test}:\n${stdout}`);
    }
  });
}
