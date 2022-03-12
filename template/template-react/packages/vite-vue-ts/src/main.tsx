import { createApp } from 'vue'
import App from './App.vue'

import { defineSpaApp } from "spa-converter/lib/ReactSpaConverter";

export default defineSpaApp((container) => {
    const app = createApp(App)
    return {
        mount() {
            app.mount(container)
            console.log('vue mount')
        },
        render() {
            console.log('vue render')
            return ''
        },
        unmount() {
            app.unmount()
            console.log('vue unmount')
        }
    }
})
