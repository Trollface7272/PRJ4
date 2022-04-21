import 'bootstrap/dist/css/bootstrap.min.css'
import './css/App.css'
import "./prestart/"
import { useEffect } from 'react'
import { Route} from "react-router-dom"
import { useHistory } from "react-router"
import LoginForm from './pages/Login'
import Dashboard from './pages/Dashboard'
import Quests from './pages/Quests'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Shop from './pages/Shop'
import Quest from './pages/Quest'
import { useCookies } from 'react-cookie'
import SendMessage from './pages/SendMessage'
import Message from './pages/Message'

function App() {
    const history = useHistory()
    const [cookies] = useCookies(["session"])
    
    useEffect(() => {if (history.location.pathname === "/") history.push("/login")})
    if (!cookies.session) history.push("/login")
    return (
        <div className="vh-100 w-100 gradient d-flex">
            <Route path={["/login"]} component={LoginForm} />
            <Route path={["/dashboard"]} component={Dashboard} />
            <Route path={["/quests"]} component={Quests} />
            <Route path={["/quest/:id"]} component={Quest} />
            <Route path={["/messages"]} component={Messages} />
            <Route path={["/message/:id"]} component={Message} />
            <Route path={["/sendmessage"]} component={SendMessage} />
            <Route path={["/shop"]} component={Shop} />
            <Route path={["/profile"]} component={Profile} />
        </div>
    )
}

export default App;