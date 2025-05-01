import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import cleaner from "rollup-plugin-cleaner";
import scss from "rollup-plugin-scss";

/** @type {import('rollup').RollupOptions[]} */
export default [
    // Browser configuration
    {
        input: "src/index.ts",
        output: {
            file: "dist/browser/easymde.min.js",
            inlineDynamicImports: true,
            sourcemap: true,
        },
        plugins: [
            cleaner({
                targets: ["./dist/browser"],
            }),
            nodeResolve(),
            scss({
                fileName: "easymde.css",
            }),
            typescript(),
            terser(),
        ],
    },
    // Node configuration
    {
        input: "src/index.ts",
        output: {
            dir: "dist/node",
            sourcemap: true,
        },
        external: [
            "marked",
            "escape-string-regexp",
            "@lezer/highlight",
            "@lezer/markdown",
            "@codemirror/lang-markdown",
            "@codemirror/language",
            "@codemirror/state",
            "@codemirror/view",
        ],
        plugins: [
            cleaner({
                targets: ["./dist/node"],
            }),
            scss({
                fileName: "easymde.css",
            }),
            typescript(),
        ],
    },
];
