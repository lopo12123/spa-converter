import ReactDOM from 'react-dom'
import App from './App'

import { defineSpaApp } from "../../utils/ReactSpaConverter";

export default defineSpaApp((container) => {
    return {
        mount() {
            ReactDOM.render(<App/>, container)
            console.log('react mount')
        },
        render() {
            console.log('react render')
            return ''
        },
        unmount() {
            ReactDOM.unmountComponentAtNode(container)
            console.log('react unmount')
        }
    }
})

