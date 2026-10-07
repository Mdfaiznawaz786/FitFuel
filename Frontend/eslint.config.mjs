import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Turn off the unused variables rule
      "@typescript-eslint/no-unused-vars": "off",
      
      // You can also add other custom rule configurations here if needed
      // "react/no-unescaped-entities": "off",
      // "react/display-name": "off",
    }
  }
];

export default eslintConfig;
