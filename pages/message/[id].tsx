import { ClientMessageTypes } from "@database/types/messages"
import { ClientUserTypes } from "@database/types/users"
import SideNav from "@components/SideNav"
import { Cookie } from "utils/cookies"
import { getMessage, getUserData } from "utils/serverUtils"
import { NextPageContext } from "next"

interface params {
    user: ClientUserTypes.User
    id: string
    message: ClientMessageTypes.Message
}

const Message = ({ user, id, message }: params) => {
    const images: { name: string, originalName: string }[] = []
    const rest: { name: string, originalName: string }[] = []

    message.fileNames.forEach((file, index) => {
        if (file.endsWith(".jpg") || file.endsWith(".png")) images.push({ name: file, originalName: message.originalNames[index] })
        else rest.push({ name: file, originalName: message.originalNames[index] })
    })
    return (
        <>
            <SideNav user={user} />
            <div className="d-flex justify-content-center align-items-center w-100 h-100" >
                <div className="card text-white bg-dark" style={{ width: "60%", height: "75%" }}>
                    <div className="card-header"><div className="card-title text-center">{"Message from:".localize()} {message.to.name}</div></div>
                    <div className="card-body">
                        <div className="card-text">{message.text}</div>
                        <div className="card-text">
                            {message.fileNames.length === 0 ? "" : "Attachments:"}
                            <div>{rest.map((file) => (<a key={file.name} href={`/files/${file.name}`} download={file.originalName}>{"Download".localize()} {file.originalName}</a>))}</div>
                            <div>{images.map((file) => (<img alt="" key={file.name} src={`/files/${file.name}`} style={{maxWidth: "50%"}} />))}</div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps({ req, res, query }: NextPageContext) {
    if (!req || !res) { console.log("weird stuff in login, getServerSideProps"); return { props: {} } }
    const cookies = Cookie.parse(req)
    if (!cookies.session) return { props: {} }
    const [backendUser, user] = await getUserData(cookies.session)
    const id = query.id as string
    const [backendMessage, frontendMessage] = await getMessage(backendUser, id)
    
    return { props: { user, message: frontendMessage, id } }
}

export default Message