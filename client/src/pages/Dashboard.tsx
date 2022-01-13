import { Card } from "react-bootstrap"
import { useHistory } from "react-router"
import SideNav from "../components/SideNav"
import { getLocal, loadLocal } from "../shared/functions"

const Dashboard = () => {
    const history = useHistory()
    return (
        <>
            <SideNav />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{overflowY: "scroll"}}>
                <div className="mx-2 my-1 float-start" onClick={() => history.push(`/quests`)}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{getLocal("quests")}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{getLocal("new-quests").replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => history.push(`/shop`)}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{getLocal("shop")}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{getLocal("new-shop-items").replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => history.push(`/messages`)}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{getLocal("messages")}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{getLocal("new-messages").replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Dashboard
