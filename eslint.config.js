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
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^next$",
          varsIgnorePattern: "^_", // Ignore variables that start with an underscore
          caughtErrors: "none", // Ignore unused variables in `catch` blocks
        },
      ],
    },
  },
  pluginJs.configs.recommended,
];
