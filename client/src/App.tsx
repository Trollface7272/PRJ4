import 'bootstrap/dist/css/bootstrap.min.css'
import './css/App.css'
import { useEffect } from 'react'
import { Route} from "react-router-dom"
import { useHistory } from "react-router"
import LoginForm from './pages/Login'
import Dashboard from './pages/Dashboard'
import Quests from './pages/quests/Quests'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Shop from './pages/Shop'
import Quest from './pages/Quest'
import { loadLocal } from './shared/functions'
import useSWR from 'swr'
import { useCookies } from 'react-cookie'

function App() {
    const history = useHistory()
    const [cookies] = useCookies(["session"])
    useSWR("local", loadLocal)
    
    useEffect(() => {if (history.location.pathname === "/") history.push("/login")})
    if (!cookies.session) history.push("/login")
    return (
        <div className="vh-100 w-100 gradient d-flex">
            <Route path={["/login"]} component={LoginForm} />
            <Route path={["/dashboard"]} component={Dashboard} />
            <Route path={["/quests"]} component={Quests} />
            <Route path={["/quest/:id"]} component={Quest} />
            <Route path={["/messages"]} component={Messages} />
            <Route path={["/shop"]} component={Shop} />
            <Route path={["/profile"]} component={Profile} />
        </div>
    )
}

export default App;
