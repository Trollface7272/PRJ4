import { ClientUserTypes } from "@database/types/users";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { Cookie } from "utils/cookies";
import { getUserData } from "utils/serverUtils";
import SideNav from "../components/SideNav"

interface params {
    user: ClientUserTypes.User
}

const Dashboard = ({ user }: params) => {
    const router = useRouter()

    if (!user) return (<>Error</>)
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="w-100 content flex-shrink-0 p-3 d-inline-block float-start" style={{ overflowY: "auto" }}>
                <div className="mx-2 my-1 float-start" onClick={() => router.push(`/quests`)}>
                    <div className="card">
                        <div className="card-header"><div className="card-title text-center">{"Quests".localize()}</div></div>
                        <div className="card-body">
                            <div className="card-text">{"You have %count% new quests.".localize().replace("%count%", "0")}</div>
                        </div>
                    </div>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => router.push(`/shop`)}>
                    <div className="card">
                        <div className="card-header"><div className="card-title text-center">{"Shop".localize()}</div></div>
                        <div className="card-body">
                            <div className="card-text">{"There are %count% new items in shop.".localize().replace("%count%", "0")}</div>
                        </div>
                    </div>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => router.push(`/messages`)}>
                    <div className="card">
                        <div className="card-header"><div className="card-title text-center">{"Messages".localize()}</div></div>
                        <div className="card-body">
                            <div className="card-text">{"You have %count% new quests.".localize().replace("%count%", "0")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [,user] = await getUserData(cookies.session)
    
    return { props: { user } }
}

export default Dashboard
