import { Card } from "react-bootstrap"
import { useHistory } from "react-router"
import SideNav from "../components/SideNav"
import { getLocal } from "../shared/functions"

const Messages = () => {
    const history = useHistory()
    return (
        <>
            <SideNav />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{overflowY: "scroll"}}>
                <div className="mx-2 my-1 float-start" onClick={() => history.push("/sendmessage")}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{getLocal("send-message")}</Card.Title></Card.Header>
                    </Card>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => {}}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{getLocal("new-messages-title")}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{getLocal("new-messages").replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Messages
