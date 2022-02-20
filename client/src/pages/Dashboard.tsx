import { Card } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useHistory } from "react-router"
import useSWR from "swr"
import SideNav from "../components/SideNav"
import { Endpoints } from "../shared/ApiEndpoints"
import { swrFetcher } from "../shared/functions"
import { EmptyUser, User } from "../types/api-users"

const Dashboard = () => {
    const history = useHistory()
    const [cookies] = useCookies(["session"])
    const { data: userRaw } = useSWR([Endpoints.User.self, cookies.session], swrFetcher)
    const { data: notificationsRaw } = useSWR([Endpoints.Notifications.all, cookies.session], swrFetcher)

    const user: User = userRaw || EmptyUser
    return (
        <>
            <SideNav />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{ overflowY: "scroll" }}>
                <div className="mx-2 my-1 float-start" onClick={() => history.push(`/quests`)}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{"Quests".localize()}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{"You have %count% new quests.".localize().replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => history.push(`/shop`)}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{"Shop".localize()}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{"There are %count% new items in shop.".localize().replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => history.push(`/messages`)}>
                    <Card>
                        <Card.Header><Card.Title className="text-center">{"Messages".localize()}</Card.Title></Card.Header>
                        <Card.Body>
                            <Card.Text>{"You have %count% new quests.".localize().replace("%count%", "0")}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Dashboard
