import { Link } from "react-router-dom";

export default function NavigationMenu() {
    return (
        <div>
            Navigation menu <br/>
            <Link to="/">home</Link> <br/>
            <Link to="/vite-react-ts">vite-react-ts</Link> <br/>
            <Link to="/vite-vue-ts">vite-vue-ts</Link> <br/>
        </div>
    )
}