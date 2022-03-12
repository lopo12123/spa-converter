import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ react() ],
    build: {
        // 子项目必须打包成库模式, 且入口文件名为 [main.js] 供主项目调用
        lib: {
            entry: resolve(__dirname, './src/main.tsx'),
            formats: [ 'es' ],
            fileName: () => 'main.js'
        }
    }
})
