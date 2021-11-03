import { useState } from "react"
import SideNav from "../components/SideNav"
import { getSessionCookie, PostRequest } from "../shared/functions"
import { EmptyQuest } from "../types/api-quests"

const Quests = () => {
    const [quests, setQuests] = useState([EmptyQuest])
    PostRequest("/quests/get", {
        session: getSessionCookie()
    }).then(r => r.json()).then(quests => {

    })
    return (
        <>
            <SideNav />
            <div className="vh-100 mw-100 content flex-shrink-0 p-3">

            </div>
        </>
    )
}

export default Quests
