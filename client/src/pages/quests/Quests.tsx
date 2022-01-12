import { useEffect, useState } from "react"
import { Row } from "react-bootstrap"
import QuestCard from "../../components/QuestCard"
import SideNav from "../../components/SideNav"
import { GetQuests } from "../../shared/functions"
import { IQuest } from "../../types/api-quests"

const Quests = () => {
    const [quests, setQuests] = useState<IQuest[]>([])
    
    useEffect(() => {
        GetQuests().then(q => setQuests(q))
    }, [])
    return (
        <>
            <SideNav />
            <div className="h-100 content flex-shrink-0 p-3 overflow-auto">
                <Row>
                    {quests.map(el => <QuestCard quest={el}></QuestCard>)}
                </Row>
            </div>
        </>
    )
}

export default Quests
