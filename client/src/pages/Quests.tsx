import { useCookies } from "react-cookie"
import { useHistory } from "react-router"
import useSWR from "swr"
import QuestCard from "../components/QuestCard"
import SideNav from "../components/SideNav"
import { loadLocal, swrFetcher } from "../shared/functions"
import { IQuest } from "../types/api-quests"

const Quests = () => {
    const [cookies] = useCookies(["session"])
    const { data } = useSWR(["/api/quests/load", cookies.session], swrFetcher)
    const history = useHistory()
    let quests: IQuest[]
    if (data) quests = data
    else quests = []

    return (
        <>
            <SideNav />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{overflowY: "scroll"}}>
            {quests.map(el => <div key={el._id} className="mx-2 my-1 float-start" onClick={() => history.push(`/quest/${el._id}`)}><QuestCard quest={el}></QuestCard></div>)}
            </div>
        </>
    )
}

export default Quests
