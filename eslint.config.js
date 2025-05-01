// Core ESLint packages
import eslint from "@eslint/js";
import typescriptEslint from "typescript-eslint";

// Plugins
import eslintConfigPrettier from "eslint-config-prettier";
import eslintConfigUnicorn from "eslint-plugin-unicorn";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginSonarJS from "eslint-plugin-sonarjs";

export default typescriptEslint.config(
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "**/*.spec.ts",
            "**/*.test.ts",
            "vitest.config.ts",
        ],
    },
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            eslintPluginImport.flatConfigs.recommended,
            eslintPluginImport.flatConfigs.typescript,
            ...typescriptEslint.configs.recommendedTypeChecked,
            ...typescriptEslint.configs.stylisticTypeChecked,
            eslintPluginSonarJS.configs.recommended,
            eslintConfigUnicorn.configs.recommended,
            eslintConfigPrettier,
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },

        // Override specific rules for TypeScript files (these will take priority over the extended configs above)
        rules: {
            "unicorn/no-null": "off",
            "import/no-unresolved": "off",
            "unicorn/prefer-top-level-await": "off",
            "import/order": [
                "error",
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: "asc",
                        orderImportKind: "asc",
                    },
                    "newlines-between": "always",
                },
            ],
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    checksVoidReturn: false,
                },
            ],
        },
    },
    {
        files: ["**.*.spec.ts", "apps/client-e2e/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
        },
    },
);
