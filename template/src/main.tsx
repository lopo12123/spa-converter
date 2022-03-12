import {StrictMode, useEffect} from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";

import App from './App'

import { ReactSpaConverter } from "../packages/utils/ReactSpaConverter";

const SpaEntry: string = import.meta.env.DEV
    ? import.meta.env.VITE_APP_SUB_SPA_ENTRY__DEV
    : import.meta.env.VITE_APP_SUB_SPA_ENTRY__PROD

const Test1 = () => {
    useEffect(() => {
        console.log('test 1')
    }, [])
    return (
        <div>
            test1
        </div>
    )
}
const Test2 = () => {
    useEffect(() => {
        console.log('test 2')
    }, [])
    return (
        <div>
            test2
        </div>
    )
}

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
