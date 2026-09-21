import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^(_|ignore)",
        },
      ],
    },
  },
  {
    ignores: [
      ".next/",
      "src/payload-types.ts",
      "src/payload-generated-schema.ts",
      "src/migrations",
    ],
  },
  {
    settings: {
      // Fix for ESLint 10+: eslint-plugin-react (a dependency of eslint-config-next) uses context.getFilename() which
      // was removed in ESLint 10 flat config. Declaring the version explicitly prevents the plugin from trying to
      // auto-detect it and failing.
      react: { version: "19" },
    },
  },
];

export default eslintConfig;
