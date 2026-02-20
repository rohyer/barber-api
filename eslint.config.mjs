import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import { config as tseslintConfig } from "typescript-eslint";
import parser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";

import { defineConfig } from "eslint/config";

export default defineConfig([
    ...tseslintConfig(),

    js.configs.recommended,

    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {
            js,
            "@typescript-eslint": tseslint,
            "@stylistic": stylistic,
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
            "@typescript-eslint/no-var-requires": "off",

            "@typescript-eslint/no-require-imports": "error", // <- esse é o que está dando erro

            "no-undef": "off", // evita 'require', 'process' como indefinidos
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            
            "curly": ["error", "multi-or-nest"],
            "nonblock-statement-body-position": ["error", "below"],

            "@stylistic/semi": ["error", "always"],
            "@stylistic/indent": ["error", 4, { SwitchCase: 1 }],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "@stylistic/arrow-parens": ["error", "as-needed"],
            "@stylistic/no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
            "@stylistic/spaced-comment": ["error", "always"],
            "@stylistic/function-paren-newline": ["error", "consistent"],
            "@stylistic/member-delimiter-style": [
                "error", {
                    "multiline": { "delimiter": "semi", "requireLast": true },
                    "singleline": { "delimiter": "semi", "requireLast": false },
                },
            ],
            "@stylistic/array-element-newline": ["error", "consistent"],
            "@stylistic/array-bracket-newline": ["error", { "multiline": true }],
            "@stylistic/object-property-newline": ["error", { "allowAllPropertiesOnSameLine": true }],
            "@stylistic/function-call-argument-newline": ["error", "consistent"],
            "@stylistic/linebreak-style": ["error", "unix"],
        },
    },
    { ignores: ["node_modules", "build", "dist"] },
]);
