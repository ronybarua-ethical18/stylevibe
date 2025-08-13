import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for Express.js applications.
 *
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export const config = [
    ...baseConfig,
    {
        files: ["**/*.{js,ts}"],
        rules: {
            "no-console": "off", // Allow console in backend

            // TypeScript rules (general, not NestJS-specific)
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-unused-vars": "off", // Using unused-imports instead

            // Unused imports/vars
            "unused-imports/no-unused-vars": [
                "error",
                {
                    "vars": "all",
                    "varsIgnorePattern": "^_",
                    "args": "after-used",
                    "argsIgnorePattern": "^_",
                    "ignoreRestSiblings": false
                }
            ],

            // Allow empty constructors (sometimes used in Express classes)
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "off",

            // No interface name prefix rule (not needed for Express, but harmless)
            "@typescript-eslint/interface-name-prefix": "off",

            // No need for explicit return types on functions (optional)
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",

            // No unused vars (handled by unused-imports)
            "no-unused-vars": "off"
        },
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                ecmaFeatures: {
                    experimentalDecorators: false // Not needed for Express
                }
            }
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
];