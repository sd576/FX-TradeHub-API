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
  },
  pluginJs.configs.recommended,
];
