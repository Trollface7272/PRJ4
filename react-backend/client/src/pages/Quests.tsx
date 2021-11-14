import { useEffect, useState } from "react"
import QuestCard from "../components/QuestCard"
import SideNav from "../components/SideNav"
import { getSessionCookie, PostRequest } from "../shared/functions"
import { Logger } from "../shared/Globals"
import { IQuest } from "../types/api-quests"

const Quests = () => {
    const [quests, setQuests] = useState<IQuest[]>([])
    
    useEffect(() => {
        PostRequest("/api/quests/load", {
            session: getSessionCookie()
        }).then(r => r.json()).then(quests => {
            Logger.debug(quests)
            setQuests(quests)
        })
    }, [])
    return (
        <>
            <SideNav />
            <div className="h-100 content flex-shrink-0 p-3">
            {quests.map(el => <QuestCard quest={el}></QuestCard>)}
            </div>
        </>
    )
}

export default Quests
