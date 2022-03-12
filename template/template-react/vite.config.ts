import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ react(), vue() ],
    server: {
        port: 8910
    },
    resolve: {
        alias: {
            "@vite-react-ts": "/packages/vite-react-ts",
            "@vite-react-ts-src": "/packages/vite-react-ts/src",
            "@vite-vue-ts": "/packages/vite-vue-ts",
            "@vite-vue-ts-src": "/packages/vite-vue-ts/src",
        }
    },
    build: {
        outDir: "./dist",
        emptyOutDir: true
    }
})
