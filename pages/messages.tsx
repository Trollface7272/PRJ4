import { ClientMessageTypes } from "@database/types/messages"
import { ClientUserTypes } from "@database/types/users"
import MessageCard from "components/MessageCard"
import { NextPageContext } from "next"
import { useRouter } from "next/router"
import { Cookie } from "utils/cookies"
import { getMessages, getUserData } from "utils/serverUtils"
import SideNav from "../components/SideNav"

interface props {
    user: ClientUserTypes.User
    messages: ClientMessageTypes.Message[]
}

const Messages = ({user, messages}: props) => {
    const router = useRouter()
    
    return (
        <div className="d-flex">
            <SideNav user={user} />
            <div className="content flex-shrink-0 p-3 d-inline-block" style={{ overflowY: "scroll" }}>
                <div className="mx-2 my-1 float-start" onClick={() => router.push("/messages/send")}>
                    <div className="card">
                        <div className="card-header"><div className="text-center">{"Send Message".localize()}</div></div>
                    </div>
                </div>
                <div className="mx-2 my-1 float-start" onClick={() => { }}>
                    {messages.length === 0 ? 
                    <div className="card">
                        <div className="card-header"><div className="card-title text-center">{"New Messages".localize()}</div></div>
                        <div className="card-body">
                            <div className="card-text">{"You got %count% new messages.".localize().replace("%count%", "0")}</div>
                        </div>
                    </div> : (messages.map((msg: ClientMessageTypes.Message) => <div className="mx-2 my-1 float-start" onClick={() => router.push(`/message/${msg._id}`)} key={msg._id}><MessageCard message={msg} /></div>))}
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, res }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, frontendUser] = await getUserData(cookies.session)
    const [backendMessages, frontendMessages] = await getMessages(backendUser)

    return { props: { user: frontendUser, messages: frontendMessages } }
}

export default Messages
