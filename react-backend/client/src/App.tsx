import { useEffect } from 'react'
import { Route} from "react-router-dom"
import { useHistory, useLocation } from "react-router"
import LoginForm from './pages/Login'
import { getSessionCookie, PostRequest } from './shared/functions'
import { ApiSession } from './types/api-users'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/App.css'
import Dashboard from './pages/Dashboard'
import Quests from './pages/quests/Quests'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Shop from './pages/Shop'
import TurnIn from './pages/quests/TurnIn'
import consola, { LogLevel } from 'consola'
consola.level = LogLevel.Verbose
function App() {
    const history = useHistory()
    const location = useLocation()
    useEffect(() => {
        if (location.pathname === "/")
        PostRequest("/api/users/session", {session: getSessionCookie()})
        .then(a => a.json())
        .then((res: ApiSession) => {
            if (!res.valid) history.push("/login")
            else if(res.valid) history.push("/dashboard")
        })
    }, [location, history])
    return (
        <div className="vh-100 w-100 gradient d-flex">
            <Route exact path={["/login"]} component={LoginForm} />
            <Route exact path={["/dashboard"]} component={Dashboard} />
            <Route exact path={["/quests"]} component={Quests} />
            <Route exact path={["/messages"]} component={Messages} />
            <Route exact path={["/shop"]} component={Shop} />
            <Route exact path={["/profile"]} component={Profile} />
            <Route exact path={["/quests/turnin/:id"]} component={TurnIn} />
        </div>
    )
}

export default App;
