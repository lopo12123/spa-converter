/// <reference types="vite/client" />
interface ImportMetaEnv {
    // VITE_APP_SUB_SPA_ENTRY__DEV.replace('{SPA_NAME}', 'read-spa-name')
    readonly VITE_APP_SUB_SPA_ENTRY__DEV: string
    // VITE_APP_SUB_SPA_ENTRY__PROD.replace('{SPA_NAME}', 'read-spa-name')
    readonly VITE_APP_SUB_SPA_ENTRY__PROD: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}