import {StrictMode} from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";

import App from './App'

import { ReactSpaConverter } from "spa-converter/lib/ReactSpaConverter";

const SpaEntry: string = import.meta.env.DEV
    ? import.meta.env.VITE_APP_SUB_SPA_ENTRY__DEV
    : import.meta.env.VITE_APP_SUB_SPA_ENTRY__PROD

ReactDOM.render(
    <StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={ <App/> }>

                    <Route path="vite-react-ts"
                           element={
                               <ReactSpaConverter key="react" entryPath={
                                   SpaEntry.replace('{SPA_NAME}', 'vite-react-ts')
                               }/>
                           }/>

                    <Route path="vite-vue-ts"
                           element={
                               <ReactSpaConverter key="vue" entryPath={
                                   SpaEntry.replace('{SPA_NAME}', 'vite-vue-ts')
                               }/>
                           }/>

                </Route>
            </Routes>
        </HashRouter>
    </StrictMode>,
    document.getElementById('root')
)
