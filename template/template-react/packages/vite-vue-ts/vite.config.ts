import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue(), vueJsx() ],
    build: {
        // 子项目必须打包成库模式, 且入口文件名为 [main.js] 供主项目调用
        lib: {
            entry: resolve(__dirname, './src/main.tsx'),
            formats: [ 'es' ],
            fileName: () => 'main.js'
        },
        outDir: "../../dist/packages/vite-vue-ts",
        emptyOutDir: false
    }
})
