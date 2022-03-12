import NavigationMenu from "./components/NavigationMenu";
import { Outlet } from "react-router-dom";

export default function App() {
    return (
        <div className="App"
             style={ {
                 position: 'relative',
                 width: '100%',
                 height: '100%',
             } }>

            <NavigationMenu/>

            <br/>

            <Outlet/>
        </div>
    )
}
