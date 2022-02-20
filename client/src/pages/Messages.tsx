import { Card } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useHistory } from "react-router"
import useSWR from "swr"
import MessageCard from "../components/MessageCard"
import SideNav from "../components/SideNav"
import { swrFetcher } from "../shared/functions"
import { IMessage } from "../types/api-quests"

const Messages = () => {
    const [cookies] = useCookies(["session"])
    const { data: msgRaw } = useSWR(["/api/messages/load", cookies.session], swrFetcher)
    const messages = msgRaw ? msgRaw : []
    const history = useHistory()
    
    return (
        <>
            <SideNav />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{ overflowY: "scroll" }}>
                <div className="mx-2 my-1 float-start" onClick={() => history.push("/sendmessage")}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{"Send Message".localize()}</Card.Title></Card.Header>
                    </Card>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => { }}>
                    {messages.length === 0 ? 
                    <Card>
                        <Card.Header><Card.Title className="text-center">{"New Messages".localize()}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{"You got %count% new messages.".localize().replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card> : (messages.map((msg: IMessage) => <div className="mx-2 my-1 float-start" onClick={() => history.push(`/message/${msg._id}`)} key={msg._id}><MessageCard message={msg} /></div>))}
                </div>
            </div>
        </>
    )
}

export default Messages
