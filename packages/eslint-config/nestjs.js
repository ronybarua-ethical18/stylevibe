import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for NestJS applications.
 *
 * @type {import("eslint").Linter.FlatConfig[]}
 */
export const config = [
    ...baseConfig,
    {
        files: ["**/*.{js,ts}"],
        rules: {
            "no-console": "off", // Allow console in backend

            // NestJS specific rules
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",

            // Allow decorators and parameter properties
            "@typescript-eslint/no-unused-vars": "off", // Using unused-imports instead
            "@typescript-eslint/no-empty-function": "off",

            // Dependency injection parameters are often not used directly
            "unused-imports/no-unused-vars": [
                "error",
                {
                    "vars": "all",
                    "varsIgnorePattern": "^_",
                    "args": "after-used",
                    "argsIgnorePattern": "^_",
                    "ignoreRestSiblings": false // Changed from true to false
                }
            ],

            // Allow empty constructors for DI
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "off",

            // NestJS uses parameter decorators extensively
            "no-unused-vars": "off"
        },
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                ecmaFeatures: {
                    experimentalDecorators: true
                }
            }
        },
    },
    {
        ignores: ["dist/**", "node_modules/**", "test/**", "**/*.spec.ts", "**/*.e2e-spec.ts"],
    },
];