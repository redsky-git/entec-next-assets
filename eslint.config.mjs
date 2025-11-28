import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // 커스텀 규칙 추가
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "jsx-quotes": ["error", "prefer-double"],
      semi: ["error", "always"],
      "@typescript-eslint/no-empty-object-type": "off",
      "react/jsx-max-props-per-line": ["error", { maximum: 1 }],
      "react-hooks/exhaustive-deps": "off",
    },
  },
]);

export default eslintConfig;
