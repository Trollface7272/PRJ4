import { useEffect } from 'react'
import { Route} from "react-router-dom"
import { useHistory, useLocation } from "react-router"
import LoginForm from './components/LoginForm'
import { getSessionCookie, PostRequest } from './shared/functions'
import { ApiSession } from './types/api-users'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/App.css'
import Dashboard from './components/Dashboard'
import Quests from './components/Quests'
import Scheadule from './components/Scheadule'
import Messages from './components/Messages'

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
        <div className="vh-100 gradient">
            <Route path={["/login"]} component={LoginForm} />
            <Route path={["/dashboard"]} component={Dashboard} />
            <Route path={["/quests"]} component={Quests} />
            <Route path={["/scheadule"]} component={Scheadule} />
            <Route path={["/messages"]} component={Messages} />
        </div>
    )
}

export default App;
