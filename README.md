### Description
Cross-framework subproject conversion layer, subprojects of any framework(vue, react, angular and ...) can be used under the main project.  

### Download  
`npm install spa-converter`  
`yarn add spa-converter`  

### Usage  
**1. In entry file for sub-spa-app**  
> for sub-spa-app with vue
```tsx
import {createApp} from "vue";
import App from "./App.vue";
import {defineSpaApp} from "spa-converter/lib/ReactSpaConverter.tsx";

// !notice: it must be a default export
export default defineSpaApp((container) => {
    const app = createApp(App)
    
    // do anything you like with app instance
    
    return {
        mount() {
            // do anything you like before app is mounted 
            app.mount(container)
        },
        render() {  // optional
            // do anything you like when app re-render
            return ''  // restricted to the return format of reactNode, please return a enpty string here
        },
        unmount() {
            // do anything you like before app is unmounted 
            app.unmount()
        }
    }
})
```

> for sub-spa-app with react  
```tsx
import ReactDOM from "react-dom";
import App from "./App";
import {defineSpaApp} from "spa-converter/lib/ReactSpaConverter.tsx";

export default defineSpaApp((container) => {
    const app = <App/>

    // do anything you like with app instance

    return {
        mount() {
            // do anything you like before app is mounted 
            ReactDOM.render(app, container)
        },
        render() {  // optional
            // do anything you like when app re-render
            return ''  // restricted to the return format of reactNode, please return a enpty string here
        },
        unmount() {
            // do anything you like before app is unmounted 
            ReactDOM.unmountComponentAtNode(container)
        }
    }
})
```

**2. In the place you use your sub-spa-app (for example: your router config)**  
> simply use
```tsx
// path to the position of entry file of your sub-app
// for example:
// when you are in dev mode, it will like '~/app1.tsx',  --(1)
// but in prod mode, '~/app1.js'.  --(2)
// that means you have to manually change it from (1) to (2) before you run your 'yarn build'.
const pathTo = {
    vue: "your-path-to-vue-sub-app",
    react: "your-path-to-rect-sub-app",
    // ... rest app
}

return (
    <Routes>
        <Route path="/" element={ <App/> }>
            <Route path="react-sub-app"
                   element={
                       // Don't forget your key here, otherwise react will consider
                       // them the same component and won't trigger a re-render
                       <ReactSpaConverter key="react" entryPath={pathTo.react}/>
                   }/>
            <Route path="vue-sub-app"
                   element={
                       <ReactSpaConverter key="vue" entryPath={pathTo.vue}/>
                   }/>
        </Route>
    </Routes>
)
```
> or, more convenient to configure in dev and prod mode, use your .env file instead.
```tsx
/// .env file
VITE_APP_subApp__DEV = '~/{APP_NAME}/~/main.tsx'
VITE_APP_subApp__PROD = '~/{APP_NAME}/~/main.js'

// .vite-env.d.ts (if you want ts support)
interface ImportMetaEnv {
    readonly VITE_APP_subApp__DEV: string
    readonly VITE_APP_subApp__PROD: string
}

/// the place you use your sub-spa-app
const appEntry: string = import.meta.env.DEV
    ? import.meta.env.VITE_APP_subApp__DEV
    : import.meta.env.VITE_APP_subApp__PROD;

return (
    <Routes>
        <Route path="/" element={ <App/> }>
            <Route path="react-sub-app"
                   element={
                       <ReactSpaConverter key="react" entryPath={
                           appEntry.replace('{APP_NAME}', 'react-sub-app')
                       }/>
                   }/>
            <Route path="vue-sub-app"
                   element={
                       <ReactSpaConverter key="vue" entryPath={
                           appEntry.replace('{APP_NAME}', 'vue-sub-app')
                       }/>
                   }/>
        </Route>
    </Routes>
)
```

### Warning  
Do not use css styles that may pollute the whole world in your sub-projects.  
you can use namespace or css module, or add a common prefix to the styles of sub-projects.

### Template  
[template project](https://github.com/lopo12123/spa-converter/tree/master/template)  
