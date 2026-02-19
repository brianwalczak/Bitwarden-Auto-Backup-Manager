import eslintConfig from "@electron-toolkit/eslint-config";

export default [
    {
        ignores: ["node_modules/", "libs/", "dist/", "build/", "renderer/vendor/"],
    },
    eslintConfig,
    {
        languageOptions: {
            globals: {
                $: "readonly",
                jQuery: "readonly",
                log: "readonly",
            },
        },
    },
];
