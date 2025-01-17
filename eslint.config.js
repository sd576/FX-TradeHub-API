import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module", // Enables ES6 modules
      },
      globals: {
        ...globals.es2022, // ES2022 globals
        ...globals.node, // Node.js globals
      },
    },
    rules: {
      // Suppress warnings for unused `next` parameter in middleware
      "no-unused-vars": ["error", { argsIgnorePattern: "^next$" }],
    },
  },
  pluginJs.configs.recommended,
];
