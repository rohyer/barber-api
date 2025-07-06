import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import { config as tseslintConfig } from "typescript-eslint";
import parser from "@typescript-eslint/parser";

import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default defineConfig([
    ...tseslintConfig(),

    js.configs.recommended,

    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {
            js,
            prettier: eslintPluginPrettier,
            "@typescript-eslint": tseslint,
        },
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: globals.node,
        },
        rules: {
            ...prettier.rules,

            "prettier/prettier": [
                "warn",
                {
                    printWidth: 100,
                    semi: true,
                    tabWidth: 4,
                    bracketSpacing: true,
                    endOfLine: "lf",
                },
            ],
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-require-imports": "error", // <- esse é o que está dando erro
            "no-undef": "off", // evita 'require', 'process' como indefinidos
        },
    },
    { ignores: ["node_modules", "build", "dist"] },
]);
